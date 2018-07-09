const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')

module.exports = async (context, command, robot) => {
  if (await filter('remind', context)) return

  const { org, repo, repoIssue, repoCreator } = await metadata(context, context.payload.issue).get() || {}
  let github = await authGH({robot, context, org})
  await github.issues.createComment(context.issue({
    owner: org,
    repo: repo,
    number: repoIssue,
    body: `Reminder to complete the requested FYI. cc @${repoCreator}`
  }))
}
