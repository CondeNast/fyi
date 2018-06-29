module.exports = async (robot, targetOrg) => {
  let github = await robot.auth()
  const installation = await github.request({
    method: 'GET',
    url: '/orgs/:org/installation',
    headers: { accept: 'application/vnd.github.machine-man-preview+json' },
    org: targetOrg
  })
  github = await robot.auth(installation.data.id)
  return github
}
