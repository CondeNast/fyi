if (require.main === module) {
  const { spawn } = require('child_process')
  let start = spawn('npm', ['start'], {env: {...process.env, PORT: process.env.NODE_PORT || 8081}})

  start.stdout.pipe(process.stdout)

  start.stderr.pipe(process.stderr)

  start.on('close', (code) => {
    process.stdout.write(`child process exited with code ${code}`)
  })
}
const metadata = require('probot-metadata')
const commands = require('probot-commands')
const filter = require('./middleware/filter')
const reauth = require('./utils/reauth')
const messaging = require('./messaging')
const Event = require('./models').Event
const Fyi = require('./models').Fyi

const repoCreated = require('./handlers/github/events/repoCreated')
const repoIdentified = require('./handlers/http/repoIdentified')
const fyiRequested = require('./handlers/github/commands/fyiRequested')
const fyiSkipped = require('./handlers/github/commands/fyiSkipped')
const fyiSubmitted = require('./handlers/github/events/fyiSubmitted')
const fyiAccepted = require('./handlers/github/commands/fyiAccepted')
const fyiRejected = require('./handlers/github/commands/fyiRejected')
const fyiReminder = require('./handlers/github/commands/fyiReminder')
const fyiClosed = require('./handlers/github/commands/fyiClosed')
const help = require('./handlers/github/commands/help')


module.exports = robot => {
  robot.log('🤖  Arch Bot is listening...')
  robot.router.use(require('@condenast/express-dogstatsd')({}))

  //github events
  robot.on('repository.created', (context) => repoCreated(context, robot))
  robot.on('issues.closed', (context) => fyiSubmitted(context, robot))

  //http api
  robot.router.post('/repo', repoIdentified(robot))

  //github commands
  commands(robot, 'request', async (context, command) => fyiRequested(context, command, robot))
  commands(robot, 'skip', async (context, command) => fyiSkipped(context, command, robot))
  commands(robot, 'accept', async (context, command) => fyiAccepted(context, command, robot))
  commands(robot, 'reject', async (context, command) => fyiRejected(context, command, robot))
  commands(robot, 'close', async (context, command) => fyiClosed(context, command, robot))
  commands(robot, 'remind', async (context, command) => fyiReminder(context, command, robot))
  commands(robot, 'help', async (context, command) => help(context, command, robot))
}
