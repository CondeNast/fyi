const commands = require('probot-commands')

const repoCreated = require('./handlers/github/events/repoCreated')
const repoIdentified = require('./handlers/http/repoIdentified')
const updateFyiDependencies = require('./handlers/http/updateFyiDependencies')
const getFyiDependencies = require('./handlers/http/getFyiDependencies')
const getFyiList = require('./handlers/http/getFyiList')
const fyiRequested = require('./handlers/github/commands/fyiRequested')
const fyiSkipped = require('./handlers/github/commands/fyiSkipped')
const fyiSubmitted = require('./handlers/github/events/fyiSubmitted')
const fyiAccepted = require('./handlers/github/commands/fyiAccepted')
const fyiRejected = require('./handlers/github/commands/fyiRejected')
const fyiReminder = require('./handlers/github/commands/fyiReminder')
const fyiClosed = require('./handlers/github/commands/fyiClosed')
const help = require('./handlers/github/commands/help')
const digest = require('./handlers/digest')

module.exports = robot => {
  robot.log('🤖  Arch Bot is listening...')
  robot.router.use(require('@condenast/express-dogstatsd')({}))

  // github events
  robot.on('repository.created', (context) => repoCreated(context, robot))
  robot.on('issues.closed', (context) => fyiSubmitted(context, robot))

  // http api
  robot.router.post('/repos', repoIdentified(robot))
  robot.router.post('/fyis/*', updateFyiDependencies)
  robot.router.get('/fyis', getFyiList)
  robot.router.get('/fyis/:fyiName', getFyiDependencies)

  // pages
  robot.router.get('/digest*', digest)
  robot.router.use('/visualization', require('express').static('public/visualization'))

  // github commands
  commands(robot, 'request', async (context, command) => fyiRequested(context, command, robot))
  commands(robot, 'skip', async (context, command) => fyiSkipped(context, command, robot))
  commands(robot, 'accept', async (context, command) => fyiAccepted(context, command, robot))
  commands(robot, 'reject', async (context, command) => fyiRejected(context, command, robot))
  commands(robot, 'close', async (context, command) => fyiClosed(context, command, robot))
  commands(robot, 'remind', async (context, command) => fyiReminder(context, command, robot))
  commands(robot, 'help', async (context, command) => help(context, command, robot))
}

