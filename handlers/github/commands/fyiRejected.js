const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')
const logPrefix = require('../../../utils/logPrefix')

module.exports = async (context, command, robot) => {
  if (await filter('reject', context)) return

  const { org, repo, repoIssue } = await metadata(context, context.payload.issue).get() || {}
  const comment = command.arguments

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name

  const LOG_PREFIX = logPrefix('fyiRejected', org, repo)
  const LOG_PREFIX_ADMIN = logPrefix('fyiRejected', adminOrg, adminRepo)

  context.log(`${LOG_PREFIX_ADMIN} command recieved`)

  await context.github.issues.createComment(context.issue({
    body: `@${context.payload.sender.login} rejected the FYI.`
  }))
  context.log(`${LOG_PREFIX_ADMIN} posted comment`)
  await context.github.issues.removeLabel(context.issue({name: 'fyi-submitted'})).catch(() => ({}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-submitted label removed`)
  await context.github.issues.addLabels(context.issue({labels: ['fyi-requested']}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-requested label added`)

  let github = await authGH({robot, context, org})
  await github.issues.edit(context.issue({
    owner: org,
    repo: repo,
    number: repoIssue,
    state: 'open'
  }))
  context.log(`${LOG_PREFIX} issue re-opened`)
  if (comment) {
    await github.issues.createComment(context.issue({
      owner: org,
      repo: repo,
      number: repoIssue,
      body: `Request has been re-opened with comment: ${comment}`
    }))
    context.log(`${LOG_PREFIX} comment posted`)
  }
}
