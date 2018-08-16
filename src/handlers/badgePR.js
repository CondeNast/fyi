const slack = require('../services/slack')
const confluence = require('../services/confluence')
const logPrefix = require('../utils/logPrefix')
const configGH = require('config').github
const authGH = require('../services/github')
const Fyi = require('../models').Fyi
const messaging = require('../messaging')

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
      const payload = Buffer.concat(dataChunks).toString()
      let data
      try {
        data = JSON.parse(payload)
      } catch (e) {
        return response.send(JSON.stringify({error: e.message, success: false}))
      }
      let { fyiName, repoOrg: org, repoName: name, shouldPR, prAssignee } = data
      const LOG_PREFIX = logPrefix('fyiAutoPR', org, name)
      app.log(`${LOG_PREFIX} http request recieved`)

      app.log(`${LOG_PREFIX} loading fyi model for ${fyiName} ...`)
      let fyi = await Fyi.forName(fyiName)
      app.log(`${LOG_PREFIX} fyi model loaded with id ${fyi.id}`)

      //make pr
      app.log(`${LOG_PREFIX} getting ready to open a badge pr...`)
      // https://github.com/hiimbex/create-pr-on-install/blob/master/index.js
      let github = await authGH({app, org})
      let context = {}
      context.repo = (repoData) => {
        return Object.assign({
          owner: org,
          repo: name
        }, repoData)
      }
      const path = 'README.md'
      const branch = `add-fyi-badge-${Math.floor((Math.random() * 100) + 1)}`

      // get the reference for the master branch
      const reference = await github.gitdata.getReference(context.repo({ ref: 'heads/master' }))
      app.log(`${LOG_PREFIX} recieved reference to master`)
      // console.log(reference)
      // create a reference in git for your branch
      await github.gitdata.createReference(context.repo({
        ref: `refs/heads/${ branch }`,
        sha: reference.data.object.sha
      }))
      app.log(`${LOG_PREFIX} created reference to ${branch}`)
      const encodedReadme = await github.repos.getReadme(context.repo({
        ref: `refs/heads/${ branch }`,
      }))
      // console.log(encodedReadme)
      const readme = Buffer.from(encodedReadme.data.content, 'base64').toString('utf8')
      app.log(`${LOG_PREFIX} decoded readme`)
      // console.log(readme)
      // return response.send()
      const newReadme = `[![](https://fyi.conde.io/badge/${fyi.id})](https://fyi.conde.io/link/${fyi.id})\n${readme}`
      app.log(`${LOG_PREFIX} created new readme`)
      // console.log(newReadme)
      const content = Buffer.from(newReadme).toString('base64')
      app.log(`${LOG_PREFIX} encoded new readme`)
      const updatedReadme = await github.repos.updateFile(context.repo({
        path,
        message: `add FYI badge`,
        content,
        sha: encodedReadme.data.sha,
        branch
      }))
      app.log(`${LOG_PREFIX} updated readme to ${branch}`)
      // console.log(updatedReadme)
      let prBody = messaging['fyi-pr']({
        fyiName: fyi.name,
        fyiId: fyi.id,
        updatedReadmeViewLink: `http://www.github.com/${org}/${name}/blob/${updatedReadme.data.commit.sha}/README.md`,
        updatedReadmeEditLink: `http://www.github.com/${org}/${name}/edit/${branch}/README.md`
      })
      app.log(`${LOG_PREFIX} generated PR body`)
      // response.send()
      const pr = await github.pullRequests.create(context.repo({
        title: 'Add FYI Badge',
        head: branch,
        base: 'master',
        body: prBody,
        maintainer_can_modify: true
      }))
      //end make pr
      // console.log(pr)
      app.log(`${LOG_PREFIX} posted a badge PR http://www.github.com/${org}/${name}/pull/${pr.data.number}`)
      return response.send({success: true})
    })
  }
}
