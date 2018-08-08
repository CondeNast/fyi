const slack = require('../../services/slack')
const confluence = require('../../services/confluence')
const logPrefix = require('../../utils/logPrefix')
const configGH = require('config').github

module.exports = (app) => {
  return (request, response) => {
    const dataChunks = []
    request.on('error', (error) => {
      response.statusCode = 500
      response.end(error.toString())
    })

    request.on('data', (chunk) => {
      dataChunks.push(chunk)
    })
    request.on('end', async () => {
      let { adminOrg, adminRepo } = configGH
      const LOG_PREFIX_ADMIN = logPrefix('fyiAutoDrip', adminOrg, adminRepo)
      app.log(`${LOG_PREFIX_ADMIN} http request recieved`)

      // fetch a random fyi from confluence
      // post fyi name, description and viewLink to slack
      app.log(`${LOG_PREFIX_ADMIN} loading random fyi object from service ...`)
      let fyi = await confluence.getRandomFyiObject()
      app.log(`${LOG_PREFIX_ADMIN} fyi object loaded`)
      const context = {}
      context.log = app.log
      await slack.post({type: 'fyi-autodrip', context, fyi})
      app.log(`${LOG_PREFIX_ADMIN} slack message posted`)
      response.send({success: true})
    })
  }
}