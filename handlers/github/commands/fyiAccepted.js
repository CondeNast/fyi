const metadata = require('probot-metadata')
const filter = require('../../../middleware/filter')
const logPrefix = require('../../../utils/logPrefix')
const Fyi = require('../../../models').Fyi
const slack = require('../../../services/slack')

module.exports = async (context, command, robot) => {
  if (await filter('accept', context)) return

  const adminOrg = context.payload.organization.login
  const adminRepo = context.payload.repository.name

  const { fyiName } = await metadata(context, context.payload.issue).get() || {}

  const LOG_PREFIX_ADMIN = logPrefix('fyiAccepted', adminOrg, adminRepo)
  context.log(`${LOG_PREFIX_ADMIN} command recieved`)

  context.log(`${LOG_PREFIX_ADMIN} loading fyi model for ${fyiName} ...`)
  let fyi = await Fyi.forName(fyiName)
  context.log(`${LOG_PREFIX_ADMIN} fyi model loaded`)


  await context.github.issues.createComment(context.issue({
    body: `@${context.payload.sender.login} accepted the FYI.`
  }))
  context.log(`${LOG_PREFIX_ADMIN} posted comment`)
  await context.github.issues.removeLabel(context.issue({name: 'fyi-submitted'})).catch(() => ({}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-submitted label removed`)
  await context.github.issues.addLabels(context.issue({labels: ['fyi-accepted']}))
  context.log(`${LOG_PREFIX_ADMIN} fyi-accepted label added`)
  await context.github.issues.edit(context.issue({
    state: 'closed'
  }))
  context.log(`${LOG_PREFIX_ADMIN} issue closed`)

  await slack.post({type: 'fyi-accepted', fyi})
  context.log(`${LOG_PREFIX_ADMIN} slack message posted`)
}
