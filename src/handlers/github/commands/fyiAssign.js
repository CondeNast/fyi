const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')
const logPrefix = require('../../../utils/logPrefix')

module.exports = async (context, command, app) => {
  if (await filter('assign', context)) return

  const { org, repo, repoIssue } = await metadata(context, context.payload.issue).get() || {}
  let assignee = (command.arguments).trim().replace(/^@/, '')

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name

  const LOG_PREFIX = logPrefix('fyiAssign', org, repo)
  const LOG_PREFIX_ADMIN = logPrefix('fyiAssign', adminOrg, adminRepo)

  context.log(`${LOG_PREFIX_ADMIN} command recieved`)
  let github = await authGH({app, context, org})
  await github.issues.addAssigneesToIssue(context.issue({
    owner: org,
    repo: repo,
    number: repoIssue,
    assignees: [assignee]
  }))
  context.log(`${LOG_PREFIX} assignee added to issue`)
}
