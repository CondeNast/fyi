const dogapi = require('dogapi')
const config = require('config')
const enabled = config.get('datadog.enabled')
if(!enabled) { module.exports = {isEnabled: () => false}; return; }
const apiKey = config.get('datadog.apiKey')
const appKey = config.get('datadog.appKey')
const moment = require('moment')

const isEnabled = () => {
  return enabled === true
}

const initialize = () => {
  if (isEnabled()) {
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
  if (!isEnabled()) {
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

const fetchAll = async () => {
  if (!isEnabled()) {
    throw new Error('datadog is not enabled')
  }
  return new Promise((resolve, reject) => {
    let now = parseInt(new Date().getTime() / 1000)
    let then = now - (24 * 3600) // a day ago
    let parameters = {
      tags: 'puppetrole:kubernetes',
      sources: 'apps'
    }

    dogapi.event.query(then, now, parameters, (err, res) => {
      if (err) {
        console.error(err)
        reject(err)
      }

      let events = res.events

      events = events.map((e) => {
        let title = e.title
        let text = e.text

        if(title === 'server.start') {
          return null
        }

        //determine the org, repo, branch from text
        let org, repo, branch
        let [,,orgRepoBranch] = text.split('/')
        let state = 0
        if(orgRepoBranch.split('_').length == 2) {
          [org, repoBranch] = orgRepoBranch.split('_')
          state = 1
        } else {
          org = 'condenast' //TODO pick from config
          repoBranch = orgRepoBranch
          state = 2
        }
        [repo,branch] = repoBranch.split(':')
        branch = branch.replace('bld-','')

        //determine app name, env, az from title
        let titleWords = title.split(' ')
        let status = titleWords[1].toLowerCase()
        let project = titleWords[3]

        let [az, appName=''] = project.split('/')
        az = (az.split('__')[0]).toLowerCase().replace(/_/g,'-')

        let appNameParts = appName.split('-')
        appName = appNameParts.slice(0,appNameParts.length-1).join('-')

        let env = appNameParts[appNameParts.length-1]
        if(env.includes('ci')) {
          env = 'ci'
        } else if(env.includes('stag') || env.includes('stg')) {
          env = 'staging'
        } else if(env.includes('prod') || env.includes('prd')) {
          env = 'production'
        } else {
          env = env
        }

        let date_happened = moment.unix(e.date_happened).tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a z')

        return {
          text,
          title,
          status,
          appName,
          org,
          repo,
          branch,
          env,
          az,
          date_happened,
          // 'datadog': e
        }
      })

      resolve(events)
    })
  }).then((events) => {
    return events
  })
}

module.exports = {
  isEnabled,
  fetch,
  fetchAll
}
