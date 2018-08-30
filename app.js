const commands = require('probot-commands')
const cors = require('cors')
const serveStatic = require('express').static('public/frontend/build')

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
const fyiAutoReminder = require('./src/handlers/http/fyiAutoReminder')
const fyiAutoDrip = require('./src/handlers/http/fyiAutoDrip')
const fyiConfluenceUpdate = require('./src/handlers/http/fyiConfluenceUpdate')
const fyiConfluenceLoad = require('./src/handlers/http/fyiConfluenceLoad')
const fyiClosed = require('./src/handlers/github/commands/fyiClosed')
const help = require('./src/handlers/github/commands/help')
const digest = require('./src/handlers/digest')
const badge = require('./src/handlers/badge')
const badgePR = require('./src/handlers/badgePR')
const link = require('./src/handlers/link')
const deploys = require('./src/handlers/deploys')

module.exports = app => {
  app.log('🤖  Arch Bot is listening...')
  app.router.use(require('@condenast/express-dogstatsd')({}))

  // github events
  app.on('repository.created', (context) => repoCreated(context, app))
  app.on('issues.closed', (context) => fyiSubmitted(context, app))

  // http api
  app.router.post('/repos', switchFormat(repoIdentified(app)))
  app.router.post('/fyis/*', switchFormat(updateFyiDependencies))
  app.router.get('/fyis', switchFormat(getFyiList))
  app.router.get('/fyis/:id/*', cors(), switchFormat(getFyiDependencies))
  app.router.post('/autoreminder', fyiAutoReminder(app))
  app.router.post('/autodrip', fyiAutoDrip(app))
  app.router.post('/badgepr', badgePR(app))
  app.router.post('/updateFromConfluence', fyiConfluenceUpdate(app))
  app.router.post('/loadFromConfluence', fyiConfluenceLoad(app))
  app.router.get('/deploys/:name', deploys)

  // pages
  app.router.get('/digest*', digest)
  app.router.use('/', serveStatic)

  // github commands
  commands(app, 'request', async (context, command) => fyiRequested(context, command, app))
  commands(app, 'skip', async (context, command) => fyiSkipped(context, command, app))
  commands(app, 'accept', async (context, command) => fyiAccepted(context, command, app))
  commands(app, 'reject', async (context, command) => fyiRejected(context, command, app))
  commands(app, 'close', async (context, command) => fyiClosed(context, command, app))
  commands(app, 'assign', async (context, command) => fyiAssign(context, command, app))
  commands(app, 'remind', async (context, command) => fyiReminder(context, command, app))
  commands(app, 'help', async (context, command) => help(context, command, app))

  // pages
  app.router.get('/digest*', digest)
  app.router.get('/badge/:id(\\d+)', badge.badgeById)
  app.router.get('/badge/:name(\\D+)', badge.badgeByName)
  app.router.get('/link/:id(\\d+)', link.linkById)
  app.router.get('/link/:name(\\D+)', link.linkByName)

  // sentry
  app.router.get('/sentry', (req, res) => {
    app.log.error('Sentry Test')
    res.end('OK')
  })
}

let switchFormat = (handler) => {
  return (req, res) => {
    res.format({
      html: function () {
        res.sendFile(require('path').resolve('public/frontend/build' + '/index.html'))
      },
      json: function () {
        return handler.apply(this, [req, res])
      }
    })
  }
}
