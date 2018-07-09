const repoCreatedHandler = require('../github/events/repoCreated')
const authGH = require('../../services/github')

module.exports = (robot) => {
  return (request, response) => {
    const dataChunks = []
    request.on('error', (error) => {
      response.statusCode = 500
      response.end(error.toString())
    })

    request.on('data', (chunk) => {
      dataChunks.push(chunk)
      console.log(chunk)
    })
    request.on('end', () => {
      const payload = Buffer.concat(dataChunks).toString()
      const data = JSON.parse(payload)
      const context = require('../test/events/new-repo-created.json')
      context.payload.repository.name = data.name
      context.payload.repository.owner.login = data.org
      context.payload.organization.login = data.org
      context.payload.sender.login = data.sender
      context.issue = (issueData) => {
        let start = {number: undefined}
        return Object.assign(start, issueData)
      }

      context.github = auth({robot, org: data.org})

      repoCreatedHandler(context, robot)
        .then(() => response.send(JSON.stringify({success: true})))
    })
  }
}
