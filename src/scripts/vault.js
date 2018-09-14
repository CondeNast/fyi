const options = {
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
}
const vault = require('node-vault')(options)

const env = process.env.NODE_ENV || 'development'
let EASY_FYI_SECRET_PATH

if (env === 'production') {
  EASY_FYI_SECRET_PATH = `secret/architecture/easy-fyi/production/production`
} else {
  EASY_FYI_SECRET_PATH = `secret/architecture/easy-fyi/nonprod/${env}`
}

module.exports = vault.read(EASY_FYI_SECRET_PATH).then((secrets) => secrets.data)
