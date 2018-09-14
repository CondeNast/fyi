const vault = require('./vault')
const env = process.env.NODE_ENV || 'development'

module.exports = () => {
  vault.then((secrets) => {
    let keys = ''
    keys += `export PRIVATE_KEY="${secrets['github-private-key']}"`
    keys += `;export WEBHOOK_PROXY_URL="${secrets['webhook-proxy-url']}"`
    keys += `;export WEBHOOK_SECRET="${secrets['webhook-secret']}"`
    let configOverride = {
      slack: {
        webhook: secrets['slack-webhook-url']
      },
      datadog: {
        apiKey: secrets['datadog-api-key'],
        appKey: secrets['datadog-app-key']
      }
    }

    if (env !== 'development') {
      Object.assign(configOverride,
        {
          database: {
            username: secrets['database-username'],
            password: secrets['database-password'],
            host: secrets['database-host'],
            database: secrets['database-name']
          }
        })
    }
    keys += `;export NODE_CONFIG='${JSON.stringify(configOverride)}'`
    console.log(keys)
  })
}

module.exports()
