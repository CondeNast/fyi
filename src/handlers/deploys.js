const datadog = require('../services/datadog')
const Fyi = require('../models').Fyi
const moment = require('moment')

module.exports = async (request, response) => {

  let {name: fyiName} = request.params

  let [fyi] = await Fyi.findAll({where: {name: fyiName}})

  if(!fyi) {
    return response.send({error: "fyi not found"})
  }

  let latestDeployEvents = await Promise.all(fyi.repos.map(async (path) => {
    let [org, repo] = path.split('/')
    let { prodDeployEvents, nonprodDeployEvents } = await datadog({org, repo})

    let deployEvent = {
      prod: {
        fyi: {
          name: fyiName,
          repo_path: path
        },
        datadog: {}
      },
      nonprod: {
        fyi: {
          name: fyiName,
          repo_path: path
        },
        datadog: {}
      }
    }
    if(prodDeployEvents.length > 0) {
      deployEvent.prod.fyi.date_happened_human = moment.unix(prodDeployEvents[0].date_happened).tz("America/New_York").format('MMMM Do YYYY, h:mm:ss a z')
      let [azTag] = prodDeployEvents[0].tags.filter(t => t.startsWith("availability-zone:"))
      deployEvent.prod.fyi.az = azTag.slice("availability-zone:".length)
      deployEvent.prod.datadog = prodDeployEvents[0]
    }

    if(nonprodDeployEvents.length > 0) {
      deployEvent.nonprod.fyi.date_happened_human = moment.unix(nonprodDeployEvents[0].date_happened).tz("America/New_York").format('MMMM Do YYYY, h:mm:ss a z')
      let [azTag] = nonprodDeployEvents[0].tags.filter(t => t.startsWith("availability-zone:"))
      deployEvent.nonprod.fyi.az = azTag.slice("availability-zone:".length)
      deployEvent.nonprod.datadog = nonprodDeployEvents[0]
    }
    return deployEvent
  }))
  response.send({events: latestDeployEvents})
}
