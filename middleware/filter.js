const metadata = require('probot-metadata')
const config = require('config').github

module.exports = async (event, context) => {
  // event validation
  const repoOrg = context.payload.organization.login
  const repoName = context.payload.repository.name
  if (event === 'repository.created') {
    // only respond to repo created event in subscribed orgs
    if (!config.subscribedOrgs.includes(repoOrg)) {
      return true // yes, block this
    }
  } else if (event === 'issues.closed') {
    // only respond to issue closed event in non-admin repo of subscribed orgs
    if (!config.subscribedOrgs.includes(repoOrg) || config.adminRepo === repoName) {
      return true
    }
    // ...and it was a FYI request issue
    const { type } = await metadata(context, context.payload.issue).get() || {}
    if (!type === 'fyi') {
      return true
    }
  } else if (['approve', 'skip', 'verify', 'reject', 'close', 'remind', 'help'].includes(event)) { // commands
    // only respond to commands by admin users in the admin repo of the admin org
    const issuer = context.payload.sender.login
    if (!config.adminUsers.includes(issuer) || config.adminOrg !== repoOrg || config.adminRepo !== repoName) {
      return true
    }
  }
  // metadata validation
  // only for events that use metadata
  if (['issues.closed', 'approve', 'reject', 'remind'].includes(event)) {
    // note: note checking for repoIssue or repoCreator which are used in some events
    const { repoOrg, repoName } = await metadata(context, context.payload.issue).get() || {}
    // malformed JSON check
    // this check is to handle malformed metadata json (possibly created if comment was manually edited)
    if (!repoOrg || !repoName) {
      return
    }
  }

  return false // do not block
}
