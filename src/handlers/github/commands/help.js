const filter = require('../../../middleware/filter')
const messaging = require('../../../messaging')
const logPrefix = require('../../../utils/logPrefix')

module.exports = async (context, command, app) => {
  if (await filter('help', context)) return

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name

  const LOG_PREFIX_ADMIN = logPrefix('help', adminOrg, adminRepo)
  context.log(`${LOG_PREFIX_ADMIN} command recieved`)

  let body = messaging['help']()
  await context.github.issues.createComment(context.issue({
    body: body
  }))
  context.log(`${LOG_PREFIX_ADMIN} comment posted`)
}
