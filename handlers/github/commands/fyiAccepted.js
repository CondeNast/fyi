const filter = require('../../../middleware/filter')

module.exports = async (context, command, robot) => {
  if (await filter('accept', context)) return

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name

  const LOG_PREFIX_ADMIN = logPrefix('fyiAccepted', adminOrg, adminRepo)
  context.log(`${LOG_PREFIX_ADMIN} command recieved`)

  await context.github.issues.createComment(context.issue({
    body: `@${context.payload.sender.login} accepted the FYI.`
  }))
  context.log(`${LOG_PREFIX_ADMIN} posted comment`)
  await context.github.issues.removeLabel(context.issue({name: 'fyi-submitted'})).catch(() => ({}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-submitted label removed`)
  await context.github.issues.addLabels(context.issue({labels: ['fyi-completed']}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-completed label added`)
  await context.github.issues.edit(context.issue({
    state: 'closed'
  }))
  context.log(`${LOG_PREFIX_ADMIN} issue closed`)
}
