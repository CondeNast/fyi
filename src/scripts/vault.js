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
let FYI_SECRET_PATH

if (env === 'production') {
  FYI_SECRET_PATH = `secret/architecture/easy-fyi/production/production`
} else {
  FYI_SECRET_PATH = `secret/architecture/easy-fyi/nonprod/${env}`
}

module.exports = vault.read(FYI_SECRET_PATH)
                      .then((secrets) => secrets.data)
                      .catch((e) => {
                        let secrets = require('config').vault.secrets.data
                        if (!secrets) {
                          console.error('secrets.json is missing!')
                          console.error('How to fix this:')
                          console.error('1. Run the command to populate it: vault read --format=json secret/architecture/easy-fyi/nonprod/development > secrets.json')
                          console.error('2. Rebuild image: npm run docker:build')
                          throw new Error('secrets.json is missing')
                        }
                        return secrets
                      })
