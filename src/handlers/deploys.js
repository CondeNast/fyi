const datadog = require('../services/datadog')
const Fyi = require('../models').Fyi

module.exports = async (request, response) => {

  let {name: fyiName} = request.params

  let [fyi] = await Fyi.findAll({where: {name: fyiName}})

  if(!fyi) {
    return response.send({error: "fyi not found"})
  }
  let [org, repo] = fyi.repos[0].split('/')
  let events = await datadog({org, repo})
  if(events.length === 0) {
    return response.send({lastDeployEvent: null})
  }
  response.send({lastDeployEvent: events[0]})
}
