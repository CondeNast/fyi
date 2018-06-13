module.exports = robot => {
  // Your code here
  robot.log('Yay, the robot was loaded!')

  robot.on('label.created', async context => {
    robot.log('Yay, my robot is loaded')
    context.log(context)
  });

  // For more information on building robots:
  // https://probot.github.io/docs/

  // To get your robot running against GitHub, see:
  // https://probot.github.io/docs/development/
}
