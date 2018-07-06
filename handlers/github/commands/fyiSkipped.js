const metadata = require('probot-metadata')
const configGH = require('config').github
const configDB = require('config').database
const filter = require('../../../middleware/filter')
const reauth = require('../../../utils/reauth')
const messaging = require('../../../messaging')
const Event = require('../../../models').Event
const Fyi = require('../../../models').Fyi


module.exports = async (context, command, robot) => {
    if (await filter('skip', context)) return

    // add label skip to this issue
    await context.github.issues.removeLabel(context.issue({name: 'repo-created'})).catch(() => ({}))
    await context.github.issues.addLabels(context.issue({labels: ['fyi-skipped']}))
    // post command activity comment in this issue (user, action)
    await context.github.issues.createComment(context.issue({
      body: `@${context.payload.sender.login} skipped the request for FYI.`
    }))
    // close this issue
    await context.github.issues.edit(context.issue({
      state: 'closed'
    }))
  }
