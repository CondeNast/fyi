const env = process.env.NODE_ENV || 'development'
let configGH = require('config').github

module.exports = () => {
  let keys = ''
  keys += `export REACT_APP_SUBSCRIBED_ORGS=${configGH.subscribedOrgs}`
  console.log(keys)
}

module.exports()
