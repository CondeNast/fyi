const filter = require('../../../middleware/filter')
const messaging = require('../../../messaging')

module.exports = async (context, command, robot) => {
  if (await filter('help', context)) return
  let body = messaging['help']()

  await context.github.issues.createComment(context.issue({
    body: body
  }))
}
