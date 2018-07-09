const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')
const Fyi = require('../../../models').Fyi

module.exports = async (context, robot) => {
  if (await filter('issues.closed', context)) return

  // TODO - edge case, if there are multiple issues created for same new repo
  // closing all of them will call this everytime each of them is closed.
  // can prevent by doing a check to only process if issue in fyi repo is still open
  const { fyiName, org: adminOrg, repo: adminRepo, repoIssue: adminRepoIssue } = await metadata(context, context.payload.issue).get() || {}
  let fyi = await Fyi.forName(fyiName)
  let github = await authGH({robot, context, org: adminOrg})
  await github.issues.removeLabel(context.issue({
    owner: adminOrg,
    repo: adminRepo,
    number: adminRepoIssue,
    name: 'fyi-requested'
  })).catch(() => ({}))
  await github.issues.addLabels(context.issue({
    owner: adminOrg,
    repo: adminRepo,
    number: adminRepoIssue,
    labels: ['fyi-submitted']}))
  await github.issues.createComment(context.issue({
    owner: adminOrg,
    repo: adminRepo,
    number: adminRepoIssue,
    body: `[FYI](${fyi.viewLink}) has been submitted.`
  }))
}
