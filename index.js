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
const Event = require('./models').Event
const config = require('config')

module.exports = robot => {
  robot.log('arch bot loaded!')

  robot.on('repository.created', async context => {
    // start - calculate probot metadata
    const repoName = context.payload.repository.name
    const repoSenderLogin = context.payload.sender.login
    const prefix = context.payload.installation.id
    let data = {}
    let json
    data[prefix] = {}
    data[prefix]['repoName'] = repoName
    data[prefix]['repoSenderLogin'] = repoSenderLogin
    data[prefix]['environment'] = process.env.NODE_ENV || 'development'
    data[prefix]['username'] = config.get('username')
    json = JSON.stringify(data)
    // end - calculate probot metadata

    // create issue in FYI repo
    await context.github.issues.create(context.issue({
      owner: 'choosenearme',
      repo: 'fyis',
      title: `Approve FYI request for new repo: ${context.payload.repository.name}`,
      body: `Repository Name: ${context.payload.repository.name}\nCreated By: ${context.payload.sender.login}\n\n<!-- probot = ${json} -->`,
      labels: ['fyi-approval'],
      assignees: ['johnkpaul', 'gautamarora']
    }))
    // metadata(context).set('repo', context.payload.repository.name)

    // add event to db
    await Event.create({
      github_project: repoName,
      system: repoName,
      event: Event.event_types['new_repo_created'],
      actor: repoSenderLogin
    })
    return;
  })

  commands(robot, 'approve', async (context, command) => {
    // retrieve issue data info from issue
    const { repoName, repoSenderLogin } = await metadata(context, context.payload.issue).get()
    const fyiRepoIssueNumber = context.payload.issue.number;
    const fyiName = command.arguments ? command.arguments : repoName
    // await metadata(context).set('system', args[0]) //if we wanted to set the system in the issue metadata

    // add labels to this issue
    await context.github.issues.deleteLabel(context.issue({name: 'fyi-approval'}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-requested']}))

    // start - calculate probot metadata
    const prefix = context.payload.installation.id
    let data = {}
    data[prefix] = {}
    data[prefix]['repoName'] = 'fyis'
    data[prefix]['repoIssueNumber'] = fyiRepoIssueNumber
    data[prefix]['fyiName'] = fyiName
    // end - calculate probot metadata

    // create issue in new repo
    const { data: { html_url: newRepoIssueUrl, number: newRepoIssueNumber } } = await context.github.issues.create(context.issue({
      owner: 'choosenearme',
      repo: repoName,
      title: `Add FYI for ${fyiName}`,
      body: `In order to increase awareness of technical work across the technology team, the Architecture team would like you to write an FYI for ${fyiName}.\n\nAn FYI is a very short description of new technical work addressing:\n  - What are the project goals, in plain language, at a very high level?\n  - Who is the main point of contact for the FYI?\n  - Where can people look for further details?\n  - When will the work happen?\n\nIf you'd like to see some examples, we have quite a few [here](https://cnissues.atlassian.net/wiki/spaces/ARCH/pages/123212691/FYIs#FYIs-FYIlist). They are intended to be very quick and easy to write. TODO - Attached is also a video showing how to create one in Confluence.\n\nPlease reply to this issue and cc @johnkpaul & @gautamarora if you'd like to have a meeting to walk through how to do this. We can schedule something and show you pretty easily, if it would help.\n\n<!-- probot = ${JSON.stringify(data)} -->`,
      assignee: repoSenderLogin
    }))
    // delete command comment
    // await context.github.issues.deleteComment(context.issue({
    //   comment_id: context.payload.comment.id
    // }))

    //update fyis repo with the issue id from new repo
    await metadata(context).set('repoIssueNumber', newRepoIssueNumber)

    // post command activity comment in this issue (user, action, new issue link)
    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} approved the request for FYI.\n\nFYI Name: ${fyiName}\nIssue: ${newRepoIssueUrl}`
    }))

    // add event to db
    await Event.create({
      github_project: repoName,
      system: repoName,
      event: Event.event_types['fyi_requested_via_github'],
      actor: repoSenderLogin
    })
    return;
  })
  commands(robot, 'skip', async (context, command) => {
    // add label skip to this issue
    await context.github.issues.deleteLabel(context.issue({name: 'fyi-approval'}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-skipped']}))
    // post command activity comment in this issue (user, action)
    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} skipped the request for FYI.`
    }))
    // close this issue
    await context.github.issues.edit(context.issue({
      state: 'closed'
    }))
    return;
  })

  robot.on('issues.closed', async context => {
    const { repoName, repoIssueNumber } = await metadata(context, context.payload.issue).get()
    await context.github.issues.deleteLabel(context.issue({
      owner: 'choosenearme',
      repo: repoName,
      number: repoIssueNumber,
      name: 'fyi-requested'
    }))
    await context.github.issues.addLabels(context.issue({
      owner: 'choosenearme',
      repo: repoName,
      number: repoIssueNumber,
      labels: ['fyi-verification']}))
    await context.github.issues.createComment(context.issue({
      owner: 'choosenearme',
      repo: repoName,
      number: repoIssueNumber,
      body: `FYI is ready for review. cc @johnkpaul @gautamarora`
    }))
  })

  commands(robot, 'verify', async (context, command) => {
    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} verified the FYI.`
    }))
    await context.github.issues.deleteLabel(context.issue({name: 'fyi-verification'}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-completed']}))
    await context.github.issues.edit(context.issue({
      state: 'closed'
    }))
  })

  commands(robot, 'reject', async (context, command) => {
    const { repoName, repoIssueNumber } = await metadata(context, context.payload.issue).get()
    const comment = command.arguments

    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} rejected the FYI.`
    }))
    await context.github.issues.deleteLabel(context.issue({name: 'fyi-verification'}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-requested']}))
    await context.github.issues.edit(context.issue({
      owner: 'choosenearme',
      repo: repoName,
      number: repoIssueNumber,
      state: 'open'
    }))
    if(comment) {
      await context.github.issues.createComment(context.issue({
        owner: 'choosenearme',
        repo: repoName,
        number: repoIssueNumber,
        body: `Request has been re-opened with comment: ${comment}`
      }))
    }
  })

  commands(robot, 'close', async (context, command) => {
    //TODO which labels need to be removed for manual close
    // await context.github.issues.deleteLabel(context.issue({name: 'fyi-requested'}))
    // await context.github.issues.deleteLabel(context.issue({name: 'fyi-verification'}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-closed']}))
    await context.github.issues.edit(context.issue({
      state: 'closed'
    }))
  })
  commands(robot, 'remind', async (context, command) => {
    const { repoName, repoSenderLogin, repoIssueNumber } = await metadata(context, context.payload.issue).get()
    console.log(repoName, repoSenderLogin, repoIssueNumber)
    await context.github.issues.createComment(context.issue({
      owner: 'choosenearme',
      repo: repoName,
      number: repoIssueNumber,
      body: `Reminder to add the requested FYI. cc @${repoSenderLogin}`
    }))
  })
  commands(robot, 'help', async (context, command) => {
    await context.github.issues.createComment(context.issue({
      body: `Here are commands you can run:\n  - \`/approve \[fyi name\]\` to approve requests\n  - \`/skip\` to skip requests\n  - \`/verify\` to verify completed FYIs\n  - \`/reject \[comment\]\` to reject submitted FYIs with optional comment\n  - \`/close\` to close this issue\n  - \`/remind\` to post a reminder on the requested issue`
    }))
  })
}
