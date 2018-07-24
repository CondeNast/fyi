const metadata = require('probot-metadata')
const moment = require('moment')
const configGH = require('config').github
const authGH = require('../../services/github')
const fyiReminderHandler = require('../github/commands/fyiReminder')

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
      // const payload = Buffer.concat(dataChunks).toString()
      // let data
      // try {
      //   data = JSON.parse(payload)
      // } catch (e) {
      //   return response.send(JSON.stringify({error: e.message, success: false}))
      // }

      // fetch all open issues in fyis repo tagged with 'fyi-requested'
      // for each, check if request issue exists and its date
      // if over 1 week, post a reminder comment in request issue
      // (optional) post in fyi issue that a reminder has been posted
      let { adminOrg, adminRepo } = configGH
      let github = await authGH({app, org: adminOrg})
      const { data: openRequestIssues } = await github.issues.getForRepo({
        owner: adminOrg,
        repo: adminRepo,
        state: 'open',
        labels: 'fyi-requested'
      })
      for (const issue of openRequestIssues) {
        const { org, repo, repoIssue } = await metadata({payload: {installation: {id: ''}}}, issue).get() || {}
        console.log(org, repo, repoIssue)
        if (!org || !repo || !repoIssue) return
        let { data: { created_at: repoIssueCreatedAt } } = await github.issues.get({
          owner: org,
          repo: repo,
          number: repoIssue
        })
        repoIssueCreatedAt = moment(repoIssueCreatedAt)
        let now = moment()
        let repoIssueCreatedDaysAgo = now.diff(repoIssueCreatedAt, 'days')
        let repoIssueCreatedWeeksAgo = Math.floor(repoIssueCreatedDaysAgo / 7)
        let isReminderDay = repoIssueCreatedDaysAgo % 7 === 0
        console.log(org, repo, repoIssueCreatedDaysAgo, isReminderDay, repoIssueCreatedWeeksAgo)
        if (isReminderDay && repoIssueCreatedWeeksAgo > 0) {
          let message
          if (repoIssueCreatedWeeksAgo === 1) {
            message = '1-Week Reminder: Complete the requested FYI'
          } else if (repoIssueCreatedWeeksAgo === 2) {
            message = '2-Week Reminder: Complete the requested FYI'
          } else if (repoIssueCreatedWeeksAgo >= 2) {
            message = 'Final Reminder: Complete the requested FYI'
          }
          console.log('sending reminder for', org, repo, repoIssueCreatedDaysAgo, isReminderDay, repoIssueCreatedWeeksAgo)
          const context = require('./issue-comment-created.json')
          context.payload.issue = issue
          context.payload.repository.name = adminRepo
          context.payload.organization.login = adminOrg
          context.payload.sender.login = 'gautamarora' // FIXME
          context.payload.message = message
          context.payload.source = 'API'

          context.issue = (issueData) => {
            let start = {}
            return Object.assign(start, issueData)
          }
          context.github = github
          context.log = app.log

          await fyiReminderHandler(context, app)
        }
      }
      console.log('Done')
      response.send({success: true})
    })
  }
}
