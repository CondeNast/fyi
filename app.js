const commands = require('probot-commands')
const cors = require('cors')
const cache = require('apicache').middleware
const ttl = '5 minutes'

// github events
const repoCreated = require('./src/handlers/github/events/repoCreated')
const fyiSubmitted = require('./src/handlers/github/events/fyiSubmitted')

// github commands
const fyiRequested = require('./src/handlers/github/commands/fyiRequested')
const fyiSkipped = require('./src/handlers/github/commands/fyiSkipped')
const fyiAccepted = require('./src/handlers/github/commands/fyiAccepted')
const fyiRejected = require('./src/handlers/github/commands/fyiRejected')
const fyiAssign = require('./src/handlers/github/commands/fyiAssign')
const fyiClosed = require('./src/handlers/github/commands/fyiClosed')
const fyiReminder = require('./src/handlers/github/commands/fyiReminder')
const help = require('./src/handlers/github/commands/help')

// client app
const env = process.env.NODE_ENV || 'development'
const express = require('express')

let serveStaticPath = 'public/frontend/build'
if(env === 'staging') {
  serveStaticPath = 'public/frontend/build-staging'
} else if(env === 'production') {
  serveStaticPath = 'public/frontend/build-production'
}
const serveStatic = express.static(serveStaticPath)

// client api
const createFyi = require('./src/handlers/api/client/createFyi')
const getFyiList = require('./src/handlers/api/client/getFyiList')
const getFyiDependencies = require('./src/handlers/api/client/getFyiDependencies')
const updateFyi = require('./src/handlers/api/client/updateFyi')
const deploys = require('./src/handlers/api/client/deploys')
const deploysAll = require('./src/handlers/api/client/deploysAll')

// jobs api
const fyiAutoReminder = require('./src/handlers/api/jobs/fyiAutoReminder')
const fyiAutoDrip = require('./src/handlers/api/jobs/fyiAutoDrip')
const fyiConfluenceUpdate = require('./src/handlers/api/jobs/fyiConfluenceUpdate')
const fyiConfluenceLoad = require('./src/handlers/api/jobs/fyiConfluenceLoad')

// actions api
const repoIdentified = require('./src/handlers/api/actions/repoIdentified')
const digest = require('./src/handlers/api/actions/digest')
const badge = require('./src/handlers/api/actions/badge')
const link = require('./src/handlers/api/actions/link')
const badgePR = require('./src/handlers/api/actions/badgePR')

module.exports = app => {
  app.log('🤖  Arch Bot is listening...')

  // github events
  app.on('repository.created', (context) => repoCreated(context, app))
  app.on('issues.closed', (context) => fyiSubmitted(context, app))

  // github commands
  commands(app, 'request', async (context, command) => fyiRequested(context, command, app))
  commands(app, 'skip', async (context, command) => fyiSkipped(context, command, app))
  commands(app, 'accept', async (context, command) => fyiAccepted(context, command, app))
  commands(app, 'reject', async (context, command) => fyiRejected(context, command, app))
  commands(app, 'close', async (context, command) => fyiClosed(context, command, app))
  commands(app, 'assign', async (context, command) => fyiAssign(context, command, app))
  commands(app, 'remind', async (context, command) => fyiReminder(context, command, app))
  commands(app, 'help', async (context, command) => help(context, command, app))

  // client app
  app.router.use('/', serveStatic)

  // client api
  app.router.get('/fyis', switchFormat(getFyiList))
  app.router.get('/fyis/:id*', cors(), switchFormat(getFyiDependencies))
  app.router.get('/deploys/:name', cache(ttl), deploys)
  app.router.get('/deploys', cache(ttl), deploysAll)
  app.router.post('/fyis', switchFormat(createFyi))
  app.router.post('/fyis/*', switchFormat(updateFyi))

  // jobs api
  app.router.post('/autodrip', fyiAutoDrip(app))
  app.router.post('/autoreminder', fyiAutoReminder(app))
  app.router.post('/loadFromConfluence', fyiConfluenceLoad(app))
  app.router.post('/updateFromConfluence', fyiConfluenceUpdate(app))

  // actions api
  app.router.post('/repos', switchFormat(repoIdentified(app)))
  app.router.get('/digest*', digest)
  app.router.get('/badge/:id(\\d+)', badge.badgeById)
  app.router.get('/badge/:name(\\D+)', badge.badgeByName)
  app.router.get('/link/:id(\\d+)', link.linkById)
  app.router.get('/link/:name(\\D+)', link.linkByName)
  app.router.post('/badgepr', badgePR(app))
}

let switchFormat = (handler) => {
  return (req, res) => {
    res.format({
      html: function () {
        res.sendFile(require('path').resolve(serveStaticPath+'/index.html'))
      },
      json: function () {
        return handler.apply(this, [req, res])
      }
    })
  }
}
