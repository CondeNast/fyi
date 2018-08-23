const slack = require('../../services/slack')
const logPrefix = require('../../utils/logPrefix')
const configGH = require('config').github
const Fyi = require('../../models').Fyi

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

      // fetch a random fyi from database
      // post fyi name, description and viewLink to slack
      app.log(`${LOG_PREFIX_ADMIN} loading random fyi object from service ...`)
      let fyi = await getRandomFyi()
      app.log(`${LOG_PREFIX_ADMIN} fyi object loaded`)
      if(!fyi) {
        return response.send({success: false})
      }
      const context = {}
      context.log = app.log
      await slack.post({type: 'fyi-autodrip', context, fyi})
      app.log(`${LOG_PREFIX_ADMIN} slack message posted`)
      response.send({success: true})
    })
  }
}

async function getRandomFyi() {
  let [fyi] = await Fyi.findAll({
    limit: 1,
    where: {
      content: { [ Fyi.sequelize.Op.ne ]: null },
      tags: { $contains: ['drip'] }
    },
    order: [ Fyi.sequelize.fn( 'RANDOM' )]
  })

  return fyi
}
