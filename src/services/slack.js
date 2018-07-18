const rp = require('request-promise-native')
const config = require('config')

const url = config.get('slack.webhook')
const channel = config.get('slack.channel')

module.exports = {
  post
}

async function post ({type, context, org, repo, repoCreator, adminOrg, adminRepo, adminIssue, fyi}) {
  let text
  if (type === 'fyi-requested') {
    let adminIssueUrl = `http://github.com/${adminOrg}/${adminRepo}/issues/${adminIssue}`
    text = `FYI Requested from ${repoCreator} for <${adminIssueUrl}|${fyi.name}>`
  } else if (type === 'fyi-accepted') {
    text = `FYI Accepted for <${fyi.viewLink}|${fyi.name}>`
  } else {
    return
  }
  await rp.post({
    url,
    body: {
      channel,
      icon_url: `https://avatars0.githubusercontent.com/in/6732?s=88`,
      username: 'archbot',
      text
    },
    json: true
  }).catch((error) => {
    context.log.error(error)
  })
}
