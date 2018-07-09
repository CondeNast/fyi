const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')

module.exports = async (context, command, robot) => {
  if (await filter('reject', context)) return

  const { org, repo, repoIssue } = await metadata(context, context.payload.issue).get() || {}
  const comment = command.arguments

  await context.github.issues.createComment(context.issue({
    body: `@${context.payload.sender.login} rejected the FYI.`
  }))
  await context.github.issues.removeLabel(context.issue({name: 'fyi-submitted'})).catch(() => ({}))
  await context.github.issues.addLabels(context.issue({labels: ['fyi-requested']}))

  let github = await authGH({robot, context, org})
  await github.issues.edit(context.issue({
    owner: org,
    repo: repo,
    number: repoIssue,
    state: 'open'
  }))
  if (comment) {
    await github.issues.createComment(context.issue({
      owner: org,
      repo: repo,
      number: repoIssue,
      body: `Request has been re-opened with comment: ${comment}`
    }))
  }
}
