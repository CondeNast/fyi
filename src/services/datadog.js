const dogapi = require('dogapi')
const config = require('config')
const enabled = config.get('datadog.enabled')
const apiKey = config.get('datadog.apiKey')
const appKey = config.get('datadog.appKey')

const isEnabled = () => {
  return enabled === true
}

const initialize = () => {
  if(isEnabled()) {
    if (!apiKey || !appKey) {
      throw new Error('datadog keys not configured')
    }
    const options = {
      api_key: apiKey,
      app_key: appKey
    }
    dogapi.initialize(options)
  }
}
initialize()

const fetch = async ({org, repo}) => {
  if(!isEnabled()) {
    throw new Error('datadog is not enabled')
  }
  return new Promise((resolve, reject) => {
    let now = parseInt(new Date().getTime() / 1000)
    let then = now - (24 * 3600) // a day ago
    let parameters = {
      tags: 'puppetrole:kubernetes',
      sources: 'apps'
    }

    let buildName = `${org.toLowerCase()}_${repo.toLowerCase()}`
    dogapi.event.query(then, now, parameters, (err, res) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      let prodDeployEvents = res.events.filter(
        e => e.title.startsWith('Deployment') && e.title.includes('__PRODUCTION') && e.text.includes(buildName)
      )
      let stagDeployEvents = res.events.filter(
        e => e.title.startsWith('Deployment') && e.title.includes('__NONPRODUCTION') && (e.title.includes('-stag') || e.title.includes('-stg')) && e.text.includes(buildName)
      )
      let ciDeployEvents = res.events.filter(
        e => e.title.startsWith('Deployment') && e.title.includes('__NONPRODUCTION') && e.title.includes('-ci') && e.text.includes(buildName)
      )

      resolve({prodDeployEvents, stagDeployEvents, ciDeployEvents})
    })
  }).then((events) => {
    return events
  })
}

module.exports = {
  isEnabled,
  fetch
}
