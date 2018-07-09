const filter = require('../../../middleware/filter')
const messaging = require('../../../messaging')

module.exports = async (context, command, robot) => {
  if (await filter('help', context)) return

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name

  const LOG_PREFIX_ADMIN = logPrefix('fyiReminder', adminOrg, adminRepo)
  context.log(`${LOG_PREFIX_ADMIN} command recieved`)

  let body = messaging['help']()
  await context.github.issues.createComment(context.issue({
    body: body
  }))
  context.log(`${LOG_PREFIX_ADMIN} comment posted`)
}
