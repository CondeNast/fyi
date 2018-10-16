const datadog = require('../../../services/datadog')

module.exports = async (request, response) => {
  if (!datadog.isEnabled()) {
    return response.send({})
  }
  let latestDeployEvents = await datadog.fetchAll()
  response.send({events: latestDeployEvents})
}
