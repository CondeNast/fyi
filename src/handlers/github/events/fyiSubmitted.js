const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')
const logPrefix = require('../../../utils/logPrefix')
const Fyi = require('../../../models').Fyi

module.exports = async (context, app) => {
  if (await filter('issues.closed', context)) return

  // TODO - edge case, if there are multiple issues created for same new repo
  // closing all of them will call this everytime each of them is closed.
  // can prevent by doing a check to only process if issue in fyi repo is still open
  const { fyiName, org: adminOrg, repo: adminRepo, repoIssue: adminRepoIssue } = await metadata(context, context.payload.issue).get() || {}

  const org = context.payload.organization.login
  const repo = context.payload.repository.name
  const LOG_PREFIX = logPrefix('fyiSubmitted', org, repo)
  const LOG_PREFIX_ADMIN = logPrefix('fyiSubmitted', adminOrg, adminRepo)

  context.log(`${LOG_PREFIX} event recieved`)

  context.log(`${LOG_PREFIX_ADMIN} loading fyi model for ${fyiName} ...`)
  let fyi = await Fyi.forName(fyiName)
  context.log(`${LOG_PREFIX_ADMIN} fyi model loaded`)

  let github = await authGH({app, context, org: adminOrg})
  await github.issues.removeLabel(context.issue({
    owner: adminOrg,
    repo: adminRepo,
    number: adminRepoIssue,
    name: 'fyi-requested'
  })).catch(() => ({}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-requested label removed`)
  await github.issues.addLabels(context.issue({
    owner: adminOrg,
    repo: adminRepo,
    number: adminRepoIssue,
    labels: ['fyi-submitted']}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-submitted label added`)
  await github.issues.createComment(context.issue({
    owner: adminOrg,
    repo: adminRepo,
    number: adminRepoIssue,
    body: `[FYI](${fyi.viewLink}) has been submitted.`
  }))
  context.log(`${LOG_PREFIX_ADMIN} posted comment`)
}
