const metadata = require('probot-metadata')
const commands = require('probot-commands')
const Event = require('./models').Event

module.exports = robot => {
  robot.log('arch bot loaded!')

  robot.on('repository.created', async context => {
    // start - calculate probot metadata
    const repoName = context.payload.repository.name
    const repoSenderLogin = context.payload.sender.login
    const prefix = context.payload.installation.id
    let data = {}
    data[prefix] = {}
    data[prefix]['repoName'] = repoName
    data[prefix]['repoSenderLogin'] = repoSenderLogin
    // end - calculate probot metadata

    await Event.create({
      github_project: repoName,
      system: repoName,
      event: Event.event_types['new_repo_created'],
      actor: repoSenderLogin
    })

    // create issue in FYI repo
    return context.github.issues.create(context.issue({
      owner: 'choosenearme',
      repo: 'fyis',
      title: `Approve FYI request for new repo: ${context.payload.repository.name}`,
      body: `Repository Name: ${context.payload.repository.name}\nCreated By: ${context.payload.sender.login}\nApprove with /yes, Ignore with /no\n\n<!-- probot = ${JSON.stringify(data)} -->`,
      labels: ['pending-approval'],
      assignees: ['johnkpaul', 'gautamarora']
    }))
    // metadata(context).set('repo', context.payload.repository.name)
  })

  commands(robot, 'yes', async (context, command) => {
    // retrieve repo info from issue meta
    const { repoName, repoSenderLogin } = await metadata(context, context.payload.issue).get()
    // await metadata(context).set('system', args[0]) //if we wanted to set the system in the issue metadata

    // add system labels to this issue
    const labels = command.arguments ? command.arguments.split(/, */) : []
    labels.push('pending-completion')
    await context.github.issues.addLabels(context.issue({labels}))
    await context.github.issues.deleteLabel(context.issue({name: 'pending-approval'}))
    // create issue in new repo
    await context.github.issues.create(context.issue({
      owner: 'choosenearme',
      repo: repoName,
      title: `Add FYI for this repo`,
      body: `FYI - why and howto`,
      assignee: repoSenderLogin
    }))
    // delete command comment
    await context.github.issues.deleteComment(context.issue({
      comment_id: context.payload.comment.id
    }))
    // post command activity comment in this issue (user, action, new issue link)
    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} approved the request for FYI`
    }))
  })
  commands(robot, 'no', async (context, command) => {
    // add label `ignore` to this issue
    const labels = command.arguments ? command.arguments.split(/, */) : []
    labels.push('completed-skip')
    await context.github.issues.addLabels(context.issue({labels}))
    await context.github.issues.deleteLabel(context.issue({name: 'pending-approval'}))
    // delete command comment
    await context.github.issues.deleteComment(context.issue({
      comment_id: context.payload.comment.id
    }))
    // post command activity comment in this issue (user, action)
    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} skipped the request for FYI`
    }))
    // close this issue
    await context.github.issues.edit(context.issue({
      state: 'closed'
    }))
  })
  commands(robot, 'close', async (context, command) => {
  })
  commands(robot, 'remind', async (context, command) => {
  })
}
