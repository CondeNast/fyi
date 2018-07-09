const filter = require('../../../middleware/filter')

module.exports = async (context, command, robot) => {
  if (await filter('close', context)) return

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name

  const LOG_PREFIX_ADMIN = logPrefix('fyiClosed', adminOrg, adminRepo)
  context.log(`${LOG_PREFIX_ADMIN} command recieved`)

  await context.github.issues.addLabels(context.issue({labels: ['fyi-closed']}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-closed label added`)
  await context.github.issues.edit(context.issue({
    state: 'closed'
  }))
  context.log(`${LOG_PREFIX_ADMIN} issue closed`)
}
