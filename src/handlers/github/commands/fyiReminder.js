const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')
const logPrefix = require('../../../utils/logPrefix')

module.exports = async (context, command, app) => {
  if (await filter('remind', context)) return

  const { org, repo, repoIssue } = await metadata(context, context.payload.issue).get() || {}

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name
  const body = context.payload.message ? context.payload.message : 'Reminder: Complete the requested FYI'

  const LOG_PREFIX = logPrefix('fyiReminder', org, repo)
  const LOG_PREFIX_ADMIN = logPrefix('fyiReminder', adminOrg, adminRepo)

  context.log(`${LOG_PREFIX_ADMIN} command recieved`)
  let github = await authGH({app, context, org})
  await github.issues.createComment(context.issue({
    owner: org,
    repo: repo,
    number: repoIssue,
    body
  }))
  context.log(`${LOG_PREFIX} comment posted`)
}
