const metadata = require('probot-metadata')
const configGH = require('config').github
const configDB = require('config').database
const filter = require('../../../middleware/filter')
const reauth = require('../../../utils/reauth')
const messaging = require('../../../messaging')
const Event = require('../../../models').Event
const Fyi = require('../../../models').Fyi


module.exports = async (context, command, robot) => {
  if (await filter('remind', context)) return

  const { org, repo, repoIssue, repoCreator } = await metadata(context, context.payload.issue).get() || {}
  let github = await reauth(robot, context, org)
  await github.issues.createComment(context.issue({
    owner: org,
    repo: repo,
    number: repoIssue,
    body: `Reminder to add the requested FYI. cc @${repoCreator}`
  }))
}
