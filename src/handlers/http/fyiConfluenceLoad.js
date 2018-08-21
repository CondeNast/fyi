const Fyi = require('../../models').Fyi
module.exports = (app) => {
  return (request, response) => {
    Fyi.loadFromConfluence().then(() => {
      app.log('Load from Confluence completed')
      response.send({success: true})
    })
  }
}

