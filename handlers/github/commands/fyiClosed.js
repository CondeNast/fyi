const metadata = require('probot-metadata')
const configGH = require('config').github
const configDB = require('config').database
const filter = require('../../../middleware/filter')
const reauth = require('../../../utils/reauth')
const messaging = require('../../../messaging')
const Event = require('../../../models').Event
const Fyi = require('../../../models').Fyi


module.exports = async (context, command, robot) => {
  if (await filter('close', context)) return
  await context.github.issues.addLabels(context.issue({labels: ['fyi-closed']}))
  await context.github.issues.edit(context.issue({
    state: 'closed'
  }))
}
