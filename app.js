const commands = require('probot-commands')
const cors = require('cors')

const repoCreated = require('./src/handlers/github/events/repoCreated')
const repoIdentified = require('./src/handlers/http/repoIdentified')
const updateFyiDependencies = require('./src/handlers/http/updateFyiDependencies')
const getFyiDependencies = require('./src/handlers/http/getFyiDependencies')
const getFyiList = require('./src/handlers/http/getFyiList')
const fyiRequested = require('./src/handlers/github/commands/fyiRequested')
const fyiSkipped = require('./src/handlers/github/commands/fyiSkipped')
const fyiSubmitted = require('./src/handlers/github/events/fyiSubmitted')
const fyiAccepted = require('./src/handlers/github/commands/fyiAccepted')
const fyiRejected = require('./src/handlers/github/commands/fyiRejected')
const fyiAssign = require('./src/handlers/github/commands/fyiAssign')
const fyiReminder = require('./src/handlers/github/commands/fyiReminder')
const fyiClosed = require('./src/handlers/github/commands/fyiClosed')
const help = require('./src/handlers/github/commands/help')
const digest = require('./src/handlers/digest')

module.exports = app => {
  app.log('🤖  Arch Bot is listening...')
  app.router.use(require('@condenast/express-dogstatsd')({}))

  // github events
  app.on('repository.created', (context) => repoCreated(context, app))
  app.on('issues.closed', (context) => fyiSubmitted(context, app))

  // http api
  app.router.post('/repos', repoIdentified(app))
  app.router.post('/fyis/*', updateFyiDependencies)
  app.router.get('/fyis', getFyiList)
  app.router.get('/fyis/:fyiName', cors(), getFyiDependencies)

  // pages
  app.router.get('/digest*', digest)
  app.router.use('/visualization', require('express').static('public/visualization'))

  // github commands
  commands(app, 'request', async (context, command) => fyiRequested(context, command, app))
  commands(app, 'skip', async (context, command) => fyiSkipped(context, command, app))
  commands(app, 'accept', async (context, command) => fyiAccepted(context, command, app))
  commands(app, 'reject', async (context, command) => fyiRejected(context, command, app))
  commands(app, 'close', async (context, command) => fyiClosed(context, command, app))
  commands(app, 'assign', async (context, command) => fyiAssign(context, command, app))
  commands(app, 'remind', async (context, command) => fyiReminder(context, command, app))
  commands(app, 'help', async (context, command) => help(context, command, app))
}