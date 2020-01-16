const configGH = require('config').github
const configDB = require('config').database
const filter = require('../../../middleware/filter')
const authGH = require('../../../services/github')
const logPrefix = require('../../../utils/logPrefix')
const messaging = require('../../../messaging')
const Event = require('../../../models').Event

module.exports = async (context, app) => {
  if (shouldDiscardWebhook(context)) return

  let { adminOrg, adminRepo, adminUsers } = configGH
    // start - calculate probot metadata
  const org = context.payload.organization.login
  const remover = context.payload.sender.login
  const fyiName = context.payload.fyiName
  const removedUser = context.payload.membership.user.login

  const LOG_PREFIX = logPrefix('memberRemoved', org, remover)
  const LOG_PREFIX_ADMIN = logPrefix('memberRemoved', adminOrg, adminRepo)
  context.log(`${LOG_PREFIX} event recieved`)

  const prefix = process.env.APP_ID
  let data = {}
  data[prefix] = {}
  data[prefix]['type'] = 'fyi'
  data[prefix]['org'] = org
  data[prefix]['repoCreator'] = remover
  data[prefix]['fyiName'] = fyiName
  let json = JSON.stringify(data)

    // calculate labels for dev and stag
  let labels = ['member-removed']
  let environment = process.env.NODE_ENV || 'development'
  let username = configDB.get('username')

  if (environment === 'development') {
    labels.push(`dev-${username}`)
  } else if (environment === 'staging') {
    labels.push(`stg`)
  }

  let body = messaging['member-removed']({
    org,
    remover,
    removedUser,
    fyiName,
    json
  })

  let title = `Member Removed: ${removedUser} by ${remover}`
  if (context.payload.source === 'API') {
    title += ' (identified)'
  }

  let github = await authGH({app, context, org: adminOrg})
  await github.issues.create({
    owner: adminOrg,
    repo: adminRepo,
    title,
    body,
    labels,
    assignees: adminUsers
  })
  context.log(`${LOG_PREFIX_ADMIN} issue created`)

  context.log(`${LOG_PREFIX} member_removed event logged`)
}

function shouldDiscardWebhook(context) {

  const org = context.payload.organization.login
  if (context.payload.action !== "member_removed") return true
  if (!configGH.subscribedOrgs.includes(org)) return true
}
