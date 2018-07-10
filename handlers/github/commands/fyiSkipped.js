const filter = require('../../../middleware/filter')
const logPrefix = require('../../../utils/logPrefix')

module.exports = async (context, command, robot) => {
  if (await filter('skip', context)) return

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name

  const LOG_PREFIX_ADMIN = logPrefix('fyiSkipped', adminOrg, adminRepo)
  context.log(`${LOG_PREFIX_ADMIN} command recieved`)
  // add label skip to this issue
  await context.github.issues.removeLabel(context.issue({name: 'repo-created'})).catch(() => ({}))
  context.log(`${LOG_PREFIX_ADMIN} repo-created label removed`)
  await context.github.issues.addLabels(context.issue({labels: ['fyi-skipped']}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-skipped label added`)
  // post command activity comment in this issue (user, action)
  await context.github.issues.createComment(context.issue({
    body: `@${context.payload.sender.login} skipped the request for FYI.`
  }))
  context.log(`${LOG_PREFIX_ADMIN} comment posted`)
  // close this issue
  await context.github.issues.edit(context.issue({
    state: 'closed'
  }))
  context.log(`${LOG_PREFIX_ADMIN} issue closed`)
}
