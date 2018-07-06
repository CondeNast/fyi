const configGH = require('config').github
const configDB = require('config').database
const filter = require('../../../middleware/filter')
const reauth = require('../../../utils/reauth')
const messaging = require('../../../messaging')
const Event = require('../../../models').Event
const Fyi = require('../../../models').Fyi


module.exports = async (context, robot) => {
  if (await filter('repository.created', context)) return

  let { adminOrg, adminRepo, adminUsers } = configGH
    // start - calculate probot metadata
  const org = context.payload.organization.login
  const repo = context.payload.repository.name
  const repoCreator = context.payload.sender.login
  const prefix = process.env.APP_ID
  let data = {}
  data[prefix] = {}
  data[prefix]['type'] = 'fyi'
  data[prefix]['org'] = org
  data[prefix]['repo'] = repo
  data[prefix]['repoCreator'] = repoCreator
  let json = JSON.stringify(data)

    // calculate labels for dev and stag
  let labels = ['fyi-approval']
  let environment = process.env.NODE_ENV || 'development'
  let username = configDB.get('username')

  if (environment === 'development') {
    labels.push(`dev-${username}`)
  } else if (environment === 'staging') {
    labels.push(`stg`)
  }

  let body = messaging['approve-fyi-request']({
    repo,
    org,
    repoCreator,
    json
  })
    // create issue in Admin repo
  let github = await reauth(robot, context, adminOrg)

  await github.issues.create(context.issue({
    owner: adminOrg,
    repo: adminRepo,
    title: `Approve FYI request for new repo: ${repo}`,
    body,
    labels,
    assignees: adminUsers
  }))

    // add event to db
  await Event.create({
    github_project: repo,
    system: repo,
    event: Event.event_types['new_repo_created'],
    actor: repoCreator
  })
}
