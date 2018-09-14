const options = {
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
}
const vault = require('node-vault')(options)

// auto-renew vault token
let refreshRate = 24 * 60 * 60 * 1000
setTimeout(function renewToken () {
  vault.tokenRenewSelf()
    .catch((err) => {
      console.error(err)
    })
    .then(() => {
      setTimeout(renewToken, refreshRate).unref()
    })
}, refreshRate).unref()

const env = process.env.NODE_ENV || 'development'
let EASY_FYI_SECRET_PATH

if (env === 'production') {
  EASY_FYI_SECRET_PATH = `secret/architecture/easy-fyi/production/production`
} else {
  EASY_FYI_SECRET_PATH = `secret/architecture/easy-fyi/nonprod/${env}`
}

module.exports = vault.read(EASY_FYI_SECRET_PATH).then((secrets) => secrets.data)
