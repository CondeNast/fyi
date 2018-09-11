const Fyi = require('../../../models').Fyi
module.exports = (app) => {
  return (request, response) => {
    Fyi.updateFromConfluence().then(() => {
      app.log('Update from Confluence completed')
      response.send({success: true})
    })
  }
}
