const CNVault = require('./vault')

module.exports = () => {
  CNVault.then((secrets) => {
    let keys = ''
    keys += `export PRIVATE_KEY="${secrets['github-private-key']}"`
    keys += `;export WEBHOOK_PROXY_URL="${secrets['webhook-proxy-url']}"`
    keys += `;export WEBHOOK_SECRET="${secrets['webhook-secret']}"`
    console.log(keys)
  })
}

module.exports()

