const filter = require('../../../middleware/filter')

module.exports = async (context, command, robot) => {
  if (await filter('accept', context)) return

  await context.github.issues.createComment(context.issue({
    body: `@${context.payload.sender.login} accepted the FYI.`
  }))
  await context.github.issues.removeLabel(context.issue({name: 'fyi-submitted'})).catch(() => ({}))
  await context.github.issues.addLabels(context.issue({labels: ['fyi-completed']}))
  await context.github.issues.edit(context.issue({
    state: 'closed'
  }))
}
