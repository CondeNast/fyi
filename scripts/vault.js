const CNVault = require('@condenast/cn-vault')
let EASY_FYI_SECRET_PATH

const env = process.env.NODE_ENV || 'development'

if (env === 'production') {
  EASY_FYI_SECRET_PATH = `secret/architecture/easy-fyi/production/production`
} else {
  EASY_FYI_SECRET_PATH = `secret/architecture/easy-fyi/nonprod/${env}`
}

let p = CNVault.getInstance().getSecrets([EASY_FYI_SECRET_PATH])

module.exports = p.then(([secrets]) => secrets, () => {
  // fallback for new production secret path
  // TODO remove after deployment
  return CNVault.getInstance().getSecrets([`secret/architecture/easy-fyi/production`]).then(([secrets]) => secrets)
})
