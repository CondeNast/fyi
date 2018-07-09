const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')

module.exports = async (context, command, robot) => {
  if (await filter('remind', context)) return

  const { org, repo, repoIssue, repoCreator } = await metadata(context, context.payload.issue).get() || {}

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name

  const LOG_PREFIX = logPrefix('fyiReminder', org, repo)
  const LOG_PREFIX_ADMIN = logPrefix('fyiReminder', adminOrg, adminRepo)

  context.log(`${LOG_PREFIX_ADMIN} command recieved`)
  let github = await authGH({robot, context, org})
  await github.issues.createComment(context.issue({
    owner: org,
    repo: repo,
    number: repoIssue,
    body: `Reminder to complete the requested FYI. cc @${repoCreator}`
  }))
  context.log(`${LOG_PREFIX} comment posted`)
}
