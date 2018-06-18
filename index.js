const metadata = require('probot-metadata')
const commands = require('probot-commands')

module.exports = robot => {
  robot.log('arch bot loaded!')

  robot.on('repository.created', async context => {
    // TODO - check if an issue for this repo already exists
    // create new issue

    // start - calculate probot metadata
    const repoName = context.payload.repository.name
    const repoSenderLogin = context.payload.sender.login
    const prefix = context.payload.installation.id
    let data = {}
    data[prefix] = {}
    data[prefix]['repoName'] = repoName
    data[prefix]['repoSenderLogin'] = repoSenderLogin
    // end - calculate probot metadata

    // create issue in FYI repo
    return context.github.issues.create(context.issue({
      owner: 'choosenearme',
      repo: 'fyis',
      title: `Approve FYI request for new repo: ${context.payload.repository.name}`,
      body: `Repository Name: ${context.payload.repository.name}\nCreated By: ${context.payload.sender.login}\nApprove with /yes, Ignore with /no\n\n<!-- probot = ${JSON.stringify(data)} -->`,
      labels: ['pending'],
      assignees: ['johnkpaul', 'gautamarora']
    }))
    // metadata(context).set('repo', context.payload.repository.name)
  })

  commands(robot, 'yes', async (context, command) => {
    const labels = command.arguments ? command.arguments.split(/, */) : []
    // retrieve repo info from issue meta
    const { repoName, repoSenderLogin } = await metadata(context, context.payload.issue).get()
    // add system lables to this issue
    // await metadata(context).set('system', args[0])
    await context.github.issues.addLabels(context.issue({labels}))
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
    // TODO add label `ignore` to this issue
    // TODO post command activity comment in this issue (user, action)
    // TODO  delete command comment
    // TODO close this issue
  })
  commands(robot, 'close', async (context, command) => {
  })
  commands(robot, 'remind', async (context, command) => {
  })
}
