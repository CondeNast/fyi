const Fyi = require('../../../models').Fyi
const moment = require('moment')
const datadog = require('../../../services/datadog')

module.exports = async (request, response) => {
  if (!datadog.isEnabled()) {
    return response.send({})
  }

  let {name: fyiName} = request.params

  let [fyi] = await Fyi.findAll({where: {name: fyiName}})

  if (!fyi) {
    return response.send({error: 'fyi not found', events: []})
  }
  if (fyi.repos.length === 0) {
    return response.send({error: 'fyi has no repos', events: []})
  }

  let latestDeployEvents = await Promise.all(fyi.repos.map(async (repoPath) => {
    let [org, repo] = repoPath.split('/')
    let { prodDeployEvents, stagDeployEvents, ciDeployEvents } = await datadog.fetch({org, repo})

    let deployEvent = {
      prod: {
        fyi: {
          name: fyiName,
          repo_path: repoPath
        },
        datadog: {}
      },
      stag: {
        fyi: {
          name: fyiName,
          repo_path: repoPath
        },
        datadog: {}
      },
      ci: {
        fyi: {
          name: fyiName,
          repo_path: repoPath
        },
        datadog: {}
      }
    }
    if (prodDeployEvents.length > 0) {
      deployEvent.prod.fyi.date_happened_human = moment.unix(prodDeployEvents[0].date_happened).tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a z')
      let [azTag] = prodDeployEvents[0].tags.filter(t => t.startsWith('availability-zone:'))
      deployEvent.prod.fyi.az = azTag.slice('availability-zone:'.length)
      deployEvent.prod.datadog = prodDeployEvents[0]
    }

    if (stagDeployEvents.length > 0) {
      deployEvent.stag.fyi.date_happened_human = moment.unix(stagDeployEvents[0].date_happened).tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a z')
      let [azTag] = stagDeployEvents[0].tags.filter(t => t.startsWith('availability-zone:'))
      deployEvent.stag.fyi.az = azTag.slice('availability-zone:'.length)
      deployEvent.stag.datadog = stagDeployEvents[0]
    }

    if (ciDeployEvents.length > 0) {
      deployEvent.ci.fyi.date_happened_human = moment.unix(ciDeployEvents[0].date_happened).tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a z')
      let [azTag] = ciDeployEvents[0].tags.filter(t => t.startsWith('availability-zone:'))
      deployEvent.ci.fyi.az = azTag.slice('availability-zone:'.length)
      deployEvent.ci.datadog = ciDeployEvents[0]
    }
    return deployEvent
  }))
  response.send({events: latestDeployEvents})
}
