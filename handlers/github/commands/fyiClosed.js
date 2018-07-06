const filter = require('../../../middleware/filter')

module.exports = async (context, command, robot) => {
  if (await filter('close', context)) return
  await context.github.issues.addLabels(context.issue({labels: ['fyi-closed']}))
  await context.github.issues.edit(context.issue({
    state: 'closed'
  }))
}
