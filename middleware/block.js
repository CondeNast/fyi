const metadata = require('probot-metadata')
const config = require('config').github

module.exports = async (event, context) => {
  //event validation
  if(event === 'repository.created') {
    //only respond to repo created event in subscribed orgs
    const repoOrg = context.payload.organization.login
    if(!config.subscribedOrgs.includes(repoOrg)) {
      return true //yes, block this
    }
  } else if(event === 'issues.closed') {
    //only respond to issue closed event in subscribed orgs
    if(!config.subscribedOrgs.includes(repoOrg)) {
      return true
    }
    //...and it was a FYI request issue
    const { type } = await metadata(context, context.payload.issue).get()
    if(!type === 'fyi') {
      return true
    }
  } else if(['approve', 'skip', 'verify', 'reject', 'close', 'remind', 'help'].includes(event)) { //commands
    //commands only work for admin users in the admin repo of the admin org
    const issuer = context.payload.sender.login
    const repoOrg = context.payload.organization.login
    const repoName = context.payload.repository.name
    if(!config.adminUsers.includes(issuer) || !config.adminOrg === repoOrg || !config.adminRepo === repoName) {
      return true
    }
  }
  return false //do not block
}
