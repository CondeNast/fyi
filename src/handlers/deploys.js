const datadog = require('../services/datadog')
const Fyi = require('../models').Fyi

module.exports = async (request, response) => {

  let {name: fyiName} = request.params

  let [fyi] = await Fyi.findAll({where: {name: fyiName}})

  if(!fyi) {
    return response.send({error: "fyi not found"})
  }

  let lastDeployEvents = await Promise.all(fyi.repos.map(async (path) => {
    let [org, repo] = path.split('/')
    console.log(path, org, repo)
    let events = await datadog({org, repo})
    console.log(events.length)
    if(events.length > 0) {
      events[0].path = path
      return events[0]
    } else {
      return {}
    }
  }))
  response.send({events: lastDeployEvents})
}
