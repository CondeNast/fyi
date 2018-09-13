const rp = require('request-promise-native')

const config = require('config')
const enabled = config.get('slack.enabled')
const channel = config.get('slack.channel')
const url = config.get('slack.webhook')

const slackify = require('slackify-html')

const isEnabled = () => {
  return enabled === true
}

const initialize = () => {
  if(isEnabled()) {
    if (!channel) {
      throw new Error('slack channel is not configured')
    }
    if (!url) {
      throw new Error('slack webhook url is not configured')
    }
  }
}
initialize()

async function post ({type, context, org, repo, repoIssue, repoCreator, adminOrg, adminRepo, adminIssue, fyi}) {
  if (!enabled) {
    return
  }
  let text
  if (type === 'fyi-requested') {
    let repoIssueUrl = `http://github.com/${org}/${repo}/issues/${repoIssue}`
    text = `💁 FYI Requested from ${repoCreator} on <${repoIssueUrl}|${org}/${repo}> for ${fyi.name}`
  } else if (type === 'fyi-requested-old') {
    let repoIssueUrl = `http://github.com/${org}/${repo}/issues/${repoIssue}`
    text = `🎫 FYI Badge Requested from ${repoCreator} on <${repoIssueUrl}|${org}/${repo}> for ${fyi.name}`
  } else if (type === 'fyi-accepted') {
    text = `🚀 FYI Accepted on ${org}/${repo} for <${fyi.viewLink}|${fyi.name}>`
  } else if (type === 'fyi-autoreminder') {
    let repoIssueUrl = `http://github.com/${org}/${repo}/issues/${repoIssue}`
    text = `⏰ FYI Reminder posted on <${repoIssueUrl}|${org}/${repo}> for ${fyi.name}`
  } else if (type === 'fyi-autodrip') {
    let fyiBody = fyi.content
    let fyiBodyMarkdown = slackify(fyiBody)
    text = `📆 FYI OTD: <${fyi.viewLink}|${fyi.name}>\n${fyiBodyMarkdown}`
  } else {
    return
  }
  await rp.post({
    url,
    body: {
      channel,
      icon_url: `https://avatars0.githubusercontent.com/in/6732?s=88`,
      username: 'archbot',
      text,
      mrkdown: true
    },
    json: true
  }).catch((error) => {
    context.log.error(error)
  })
}

module.exports = {
  isEnabled,
  post
}
