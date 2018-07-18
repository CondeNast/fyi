const repoCreatedHandler = require('../github/events/repoCreated')
const authGH = require('../../services/github')

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
    request.on('end', () => {
      const payload = Buffer.concat(dataChunks).toString()
      let data
      try {
        data = JSON.parse(payload)
      } catch (e) {
        return response.send(JSON.stringify({error: e.message, success: false}))
      }
      const context = require('./repo-created.json')
      context.payload.repository.name = data.name
      context.payload.repository.owner.login = data.org
      context.payload.organization.login = data.org
      context.payload.sender.login = data.creator
      context.payload.source = 'API'
      context.issue = (issueData) => {
        let start = {number: undefined}
        return Object.assign(start, issueData)
      }

      context.github = authGH({app, org: data.org})
      context.log = app.log

      repoCreatedHandler(context, app)
        .then(() => response.send(JSON.stringify({success: true})))
    })
  }
}
