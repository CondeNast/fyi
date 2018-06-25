const CNVault = require('@condenast/cn-vault')
let EASY_FYI_SECRET_PATH

const env = process.env.NODE_ENV || "development"

if (env === "production") {
  EASY_FYI_SECRET_PATH = `secret/architecture/easy-fyi/production`
}
else {
  EASY_FYI_SECRET_PATH = `secret/architecture/easy-fyi/nonprod/${env}`
}

module.exports = () => {
  CNVault.getInstance().getSecrets([EASY_FYI_SECRET_PATH])
      .then(([secrets]) => {
        console.log(secrets['github-private-key'])
      })
}

module.exports()
