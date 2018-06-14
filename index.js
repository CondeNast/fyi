const commands = require('probot-commands')

module.exports = robot => {
  robot.log('arch bot loaded!')

  robot.on('repository.created', async context => {

    //TODO - check if an issue for this repo already exists
    //create new issue
    //TODO add new repo info in the issue meta
    const params = context.issue({
      owner: 'CondeNast',
      repo: 'fyis',
      title: `Request FYI for new repo: ${context.payload.repository.name}`
    })
    return context.github.issues.create(params)
  })

  commands(robot, 'yes', (context, command) => {
    // const labels = command.arguments.split(/, */);
    // return context.github.issues.addLabels(context.issue({labels}));
    const args = command.arguments.split(/, */);
    robot.log(command, args)
    //TODO if cmd === YES
      //TODO retrieve repo info from issue meta
      //TODO update meta to add system info and update this issue
      //TODO create new issue in repo
      //TODO add label `pending` to this issue
      //TODO post command activity comment in this issue (user, action, new issue link)
      //TODO delete command comment
    //TODO if cmd === NO
      //TODO add label `ignore` to this issue
      //TODO post command activity comment in this issue (user, action)
      //TODO  delete command comment
      //TODO close this issue
    //TODO if cmd === CANCEL
    //TODO if cmd === REMIND
  });

}
