module.exports = robot => {
  robot.log('Yay, the robot was loaded!')

  robot.on('repository.created', async context => {
    context.log(`new repo: ${context.payload.repository.name} created by ${context.payload.sender.login}`)
  });
}
