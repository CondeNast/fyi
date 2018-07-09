const configGH = require('config').github
const configDB = require('config').database
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')
const logPrefix = require('../../../utils/logPrefix')
const messaging = require('../../../messaging')
const Event = require('../../../models').Event

module.exports = async (context, robot) => {
  if (await filter('repository.created', context)) return

  let { adminOrg, adminRepo, adminUsers } = configGH
    // start - calculate probot metadata
  const org = context.payload.organization.login
  const repo = context.payload.repository.name
  const repoCreator = context.payload.sender.login
  const LOG_PREFIX = logPrefix('repo.created', org, repo)

  const prefix = process.env.APP_ID
  let data = {}
  data[prefix] = {}
  data[prefix]['type'] = 'fyi'
  data[prefix]['org'] = org
  data[prefix]['repo'] = repo
  data[prefix]['repoCreator'] = repoCreator
  let json = JSON.stringify(data)

    // calculate labels for dev and stag
  let labels = ['repo-created']
  let environment = process.env.NODE_ENV || 'development'
  let username = configDB.get('username')

  if (environment === 'development') {
    labels.push(`dev-${username}`)
  } else if (environment === 'staging') {
    labels.push(`stg`)
  }

  let body = messaging['repo-created']({
    repo,
    org,
    repoCreator,
    json
  })

  let github = await authGH({robot, context, org: adminOrg})

  await github.issues.create(context.issue({
    owner: adminOrg,
    repo: adminRepo,
    title: `Repo created: ${org}/${repo}`,
    body,
    labels,
    assignees: adminUsers
  }))
  context.log(`${LOG_PREFIX} new repo issue created`)

    // add event to db
  await Event.create({
    github_project: repo,
    system: repo,
    event: Event.event_types['repo_created'],
    actor: repoCreator
  })
  context.log(`${LOG_PREFIX} repo created event logged`)
}
