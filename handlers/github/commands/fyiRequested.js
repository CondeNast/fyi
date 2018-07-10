const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')
const slack = require('../../../services/slack')
const logPrefix = require('../../../utils/logPrefix')
const messaging = require('../../../messaging')
const Event = require('../../../models').Event
const Fyi = require('../../../models').Fyi

module.exports = async (context, command, robot) => {
  if (await filter('request', context)) return

  // retrieve issue data info from issue
  const { org, repo, repoCreator } = await metadata(context, context.payload.issue).get() || {}
  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name
  const adminIssue = context.payload.issue.number
  const fyiName = command.arguments ? command.arguments : repo

  const LOG_PREFIX = logPrefix('fyiRequested', org, repo)
  const LOG_PREFIX_ADMIN = logPrefix('fyiRequested', adminOrg, adminRepo)
  context.log(`${LOG_PREFIX_ADMIN} command recieved`)

  // update labels this issue
  await context.github.issues.removeLabel(context.issue({name: 'repo-created'})).catch(() => ({})) // noop
  // await context.github.issues.removeLabel(context.issue({name: 'repo-identified'})).catch(() => ({}))
  context.log(`${LOG_PREFIX_ADMIN} repo-created label removed`)
  await context.github.issues.addLabels(context.issue({labels: ['fyi-requested']}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-requested label added`)

  // start - calculate probot metadata
  const prefix = process.env.APP_ID
  let data = {}
  data[prefix] = {}
  data[prefix]['type'] = 'fyi'
  data[prefix]['org'] = adminOrg
  data[prefix]['repo'] = adminRepo
  data[prefix]['repoIssue'] = adminIssue
  data[prefix]['fyiName'] = fyiName
  let json = JSON.stringify(data)

  context.log(`${LOG_PREFIX_ADMIN} loading fyi model for ${fyiName} ...`)
  let fyi = await Fyi.forName(fyiName)
  context.log(`${LOG_PREFIX_ADMIN} fyi model loaded`)

  // create issue in new repo
  let github = await authGH({robot, context, org})
  let body = messaging['fyi-request']({
    fyiName: fyi.name,
    json,
    editLink: fyi.editLink
  })

  const { data: { html_url: repoIssueUrl, number: repoIssue } } = await github.issues.create(context.issue({
    owner: org,
    repo: repo,
    title: `Add FYI for ${fyiName}`,
    body: body,
    assignee: repoCreator
  }))
  context.log(`${LOG_PREFIX} request issue created`)

  let bodyForAdminRepo = messaging['fyi-requested']({
    requester: context.payload.sender.login,
    fyiName,
    repoIssueUrl,
    viewLink: fyi.viewLink
  })
  // update admin issue body with request issue and fyi name
  await metadata(context).set('repoIssue', repoIssue)
  await metadata(context).set('fyiName', fyiName)
  context.log(`${LOG_PREFIX_ADMIN} admin issue updated with request issue id & fyi name`)
  // post command activity comment in this issue (user, action, new issue link)
  await context.github.issues.createComment(context.issue({
    body: bodyForAdminRepo
  }))
  context.log(`${LOG_PREFIX_ADMIN} comment posted`)

  await slack.post({type: 'fyi-requested', context, adminOrg, adminRepo, adminIssue, fyi})
  context.log(`${LOG_PREFIX_ADMIN} slack message posted`)

  // add event to db
  await Event.create({
    github_project: repo,
    system: repo,
    event: Event.event_types['fyi_requested_via_github'],
    actor: repoCreator
  })
  context.log(`${LOG_PREFIX} fyi_requested_via_github event logged`)
}
