module.exports = async ({app, context, org: targetOrg}) => {
  let github
  let shouldAuth = true
  if (context) {
    let srcOrg = context.payload.organization.login
    if (srcOrg === targetOrg) {
      github = context.github
      shouldAuth = false
    }
  }
  if (shouldAuth) {
    github = await app.auth()
    const installation = await github.request({
      method: 'GET',
      url: '/orgs/:org/installation',
      headers: { accept: 'application/vnd.github.machine-man-preview+json' },
      org: targetOrg
    })
    github = await app.auth(installation.data.id)
  }
  return github
}
