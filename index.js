if (require.main === module) {
  const { spawn } = require('child_process')
  let start = spawn('npm', ['start'], {env: {...process.env, PORT: process.env.NODE_PORT || 8081}})

  start.stdout.on('data', (data) => {
    process.stdout.write(`stdout: ${data}`)
  })

  start.stderr.on('data', (data) => {
    process.stderr.write(`stderr: ${data}`)
  })

  start.on('close', (code) => {
    process.stdout.write(`child process exited with code ${code}`)
  })
}

const metadata = require('probot-metadata')
const commands = require('probot-commands')
const configGH = require('config').github
const configDB = require('config').database
const filter = require('./middleware/filter')
const messaging = require('./messaging')
const Event = require('./models').Event
const Fyi = require('./models').Fyi

module.exports = robot => {
  robot.log('🤖  Arch Bot is listening...')
  robot.router.use(require('@condenast/express-dogstatsd')({}))
  robot.on('repository.created', async context => {
    if (await filter('repository.created', context)) return
    // start - calculate probot metadata
    const repoOrg = context.payload.organization.login
    const repoName = context.payload.repository.name
    const repoCreator = context.payload.sender.login
    const prefix = context.payload.installation.id
    let data = {}
    data[prefix] = {}
    data[prefix]['type'] = 'fyi'
    data[prefix]['repoOrg'] = repoOrg
    data[prefix]['repoName'] = repoName
    data[prefix]['repoCreator'] = repoCreator
    let json = JSON.stringify(data)

    // calculate labels for dev and stag
    let labels = ['fyi-approval']
    let environment = process.env.NODE_ENV || 'development'
    let username = configDB.get('username')

    if (environment === 'development') {
      labels.push(`dev-${username}`)
    } else if (environment === 'staging') {
      labels.push(`stg`)
    }

    // create issue in FYI repo
    await context.github.issues.create(context.issue({
      owner: configGH.adminOrg,
      repo: configGH.adminRepo,
      title: `Approve FYI request for new repo: ${repoName}`,
      body: `Repository Name: ${repoName}\nCreated By: ${repoName}\n\n<!-- probot = ${json} -->`,
      labels,
      assignees: configGH.adminUsers
    }))
    // metadata(context).set('repo', context.payload.repository.name)

    // add event to db
    await Event.create({
      github_project: repoName,
      system: repoName,
      event: Event.event_types['new_repo_created'],
      actor: repoCreator
    })
  })

  commands(robot, 'approve', async (context, command) => {
    if (await filter('approve', context)) return
    // retrieve issue data info from issue
    const { repoOrg, repoName, repoCreator } = await metadata(context, context.payload.issue).get() || {}
    const fyiRepoOrg = context.payload.organization.login
    const fyiRepoName = context.payload.repository.name
    const fyiRepoIssue = context.payload.issue.number
    const fyiName = command.arguments ? command.arguments : repoName

    // update labels this issue
    await context.github.issues.deleteLabel(context.issue({name: 'fyi-approval'})).catch(() => ({})) // noop
    await context.github.issues.addLabels(context.issue({labels: ['fyi-requested']}))

    // start - calculate probot metadata
    const prefix = context.payload.installation.id
    let data = {}
    data[prefix] = {}
    data[prefix]['type'] = 'fyi'
    data[prefix]['repoOrg'] = fyiRepoOrg
    data[prefix]['repoName'] = fyiRepoName
    data[prefix]['repoIssue'] = fyiRepoIssue
    data[prefix]['fyiName'] = fyiName
    let json = JSON.stringify(data)

    let fyi = await Fyi.forName(fyiName)

    // create issue in new repo
    let body = messaging['new-fyi-requested']({
      fyiName: fyi.name,
      json,
      editLink: fyi.editLink
    })

    const { data: { html_url: newRepoIssueUrl, number: newRepoIssue } } = await context.github.issues.create(context.issue({
      owner: repoOrg,
      repo: repoName,
      title: `Add FYI for ${fyiName}`,
      body: body,
      assignee: repoCreator
    }))
    // delete command comment
    // await context.github.issues.deleteComment(context.issue({
    //   comment_id: context.payload.comment.id
    // }))

    // update fyis repo with the issue id from new repo
    await metadata(context).set('repoIssue', newRepoIssue)

    // post command activity comment in this issue (user, action, new issue link)
    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} approved the request for FYI.\n\nFYI Name: ${fyiName}\nIssue: ${newRepoIssueUrl}`
    }))

    // add event to db
    await Event.create({
      github_project: repoName,
      system: repoName,
      event: Event.event_types['fyi_requested_via_github'],
      actor: repoCreator
    })
  })
  commands(robot, 'skip', async (context, command) => {
    if (await filter('skip', context)) return
    // add label skip to this issue
    await context.github.issues.deleteLabel(context.issue({name: 'fyi-approval'})).catch(() => ({}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-skipped']}))
    // post command activity comment in this issue (user, action)
    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} skipped the request for FYI.`
    }))
    // close this issue
    await context.github.issues.edit(context.issue({
      state: 'closed'
    }))
  })

  robot.on('issues.closed', async context => {
    if (await filter('issues.closed', context)) return
    const { repoOrg, repoName, repoIssue } = await metadata(context, context.payload.issue).get() || {}
    await context.github.issues.deleteLabel(context.issue({
      owner: repoOrg,
      repo: repoName,
      number: repoIssue,
      name: 'fyi-requested'
    })).catch(() => ({}))
    await context.github.issues.addLabels(context.issue({
      owner: repoOrg,
      repo: repoName,
      number: repoIssue,
      labels: ['fyi-verification']}))
    await context.github.issues.createComment(context.issue({
      owner: repoOrg,
      repo: repoName,
      number: repoIssue,
      body: `FYI is ready for review.`
    }))
  })

  commands(robot, 'verify', async (context, command) => {
    if (await filter('verify', context)) return
    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} verified the FYI.`
    }))
    await context.github.issues.deleteLabel(context.issue({name: 'fyi-verification'})).catch(() => ({}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-completed']}))
    await context.github.issues.edit(context.issue({
      state: 'closed'
    }))
  })

  commands(robot, 'reject', async (context, command) => {
    if (await filter('reject', context)) return
    const { repoOrg, repoName, repoIssue } = await metadata(context, context.payload.issue).get() || {}
    // malformed JSON check
    if (!repoOrg || !repoName || !repoIssue) {
      return
    }
    const comment = command.arguments

    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} rejected the FYI.`
    }))
    await context.github.issues.deleteLabel(context.issue({name: 'fyi-verification'})).catch(() => ({}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-requested']}))
    await context.github.issues.edit(context.issue({
      owner: repoOrg,
      repo: repoName,
      number: repoIssue,
      state: 'open'
    }))
    if (comment) {
      await context.github.issues.createComment(context.issue({
        owner: repoOrg,
        repo: repoName,
        number: repoIssue,
        body: `Request has been re-opened with comment: ${comment}`
      }))
    }
  })

  commands(robot, 'close', async (context, command) => {
    if (await filter('close', context)) return
    // TODO which labels need to be removed for manual close
    // await context.github.issues.deleteLabel(context.issue({name: 'fyi-requested'})).catch(()=>({}))
    // await context.github.issues.deleteLabel(context.issue({name: 'fyi-verification'})).catch(()=>({}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-closed']}))
    await context.github.issues.edit(context.issue({
      state: 'closed'
    }))
  })
  commands(robot, 'remind', async (context, command) => {
    if (await filter('remind', context)) return
    const { repoOrg, repoName, repoIssue, repoCreator } = await metadata(context, context.payload.issue).get() || {}
    await context.github.issues.createComment(context.issue({
      owner: repoOrg,
      repo: repoName,
      number: repoIssue,
      body: `Reminder to add the requested FYI. cc @${repoCreator}`
    }))
  })
  commands(robot, 'help', async (context, command) => {
    if (await filter('help', context)) return
    let body = messaging['help']()

    await context.github.issues.createComment(context.issue({
      body: body
    }))
  })
}
