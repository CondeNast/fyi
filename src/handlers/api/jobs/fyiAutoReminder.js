const metadata = require('probot-metadata')
const moment = require('moment')
const slack = require('../../../services/slack')
const logPrefix = require('../../../utils/logPrefix')
const configGH = require('config').github
const authGH = require('../../../services/github')
const fyiReminderHandler = require('../../github/commands/fyiReminder')
const Fyi = require('../../../models').Fyi

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
      let { adminOrg, adminRepo } = configGH
      const LOG_PREFIX_ADMIN = logPrefix('fyiAutoReminder', adminOrg, adminRepo)
      app.log(`${LOG_PREFIX_ADMIN} http request recieved`)

      // fetch all open issues in fyis repo tagged with 'fyi-requested'
      // for each, check if request issue exists and its date
      // if over 1 week, post a reminder comment in request issue
      // (optional) post in fyi issue that a reminder has been posted
      let github = await authGH({app, org: adminOrg})
      const { data: openRequestIssues } = await github.issues.getForRepo({
        owner: adminOrg,
        repo: adminRepo,
        state: 'open',
        labels: 'fyi-requested'
      })
      app.log(`${LOG_PREFIX_ADMIN} ${openRequestIssues.length} open issues fetched`)
      for (const adminIssue of openRequestIssues) {
        const { org, repo, repoIssue, fyiName } = await metadata({payload: {installation: {id: ''}}}, adminIssue).get() || {}
        if (!org || !repo || !repoIssue) return
        github = await authGH({app, org})
        try {
          var { data: { created_at: repoIssueCreatedAt } } = await github.issues.get({
            owner: org,
            repo: repo,
            number: repoIssue
          })
        } catch (e) {
          app.log.error(`${LOG_PREFIX_ADMIN} error sending reminder for ${org}/${repo}`, e)
        }
        repoIssueCreatedAt = moment(repoIssueCreatedAt)
        let now = moment()
        let repoIssueCreatedDaysAgo = now.diff(repoIssueCreatedAt, 'days')
        let repoIssueCreatedWeeksAgo = Math.floor(repoIssueCreatedDaysAgo / 7)
        let isReminderDay = repoIssueCreatedDaysAgo % 7 === 0
        if (isReminderDay && repoIssueCreatedWeeksAgo > 0) {
          app.log(`${LOG_PREFIX_ADMIN} preparing to send reminder for ${org}/${repo}`)
          let message
          if (repoIssueCreatedWeeksAgo === 1) {
            message = '1-Week Reminder: Complete the requested FYI'
          } else if (repoIssueCreatedWeeksAgo === 2) {
            message = '2-Week Reminder: Complete the requested FYI'
          } else if (repoIssueCreatedWeeksAgo >= 2) {
            message = 'Final Reminder: Complete the requested FYI'
          }
          const context = require('../fixtures/issue-comment-created.json')
          context.payload.issue = adminIssue
          context.payload.repository.name = adminRepo
          context.payload.organization.login = adminOrg
          context.payload.sender.login = 'API'
          context.payload.message = message
          context.payload.source = 'API'

          context.issue = (issueData) => {
            return Object.assign({}, issueData)
          }
          github = await authGH({app, org: adminOrg})
          context.github = github
          context.log = app.log

          await fyiReminderHandler(context, 'remind', app)
          app.log(`${LOG_PREFIX_ADMIN} reminder sent for ${org}/${repo}`)

          app.log(`${LOG_PREFIX_ADMIN} loading fyi model for ${fyiName} ...`)
          let fyi = await Fyi.forName(fyiName)
          app.log(`${LOG_PREFIX_ADMIN} fyi model loaded`)

          await slack.post({type: 'fyi-autoreminder', context, org, repo, repoIssue, adminOrg, adminRepo, adminIssue: adminIssue.number, fyi})
          app.log(`${LOG_PREFIX_ADMIN} slack message posted`)
        } else {
          app.log(`${LOG_PREFIX_ADMIN} not sending reminder for ${org}/${repo} | day ${repoIssueCreatedDaysAgo}`)
        }
      }
      response.send({success: true})
    })
  }
}
