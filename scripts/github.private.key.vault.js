const CNVault = require('@condenast/cn-vault');

const EASY_FYI_SECRET_PATH = "secret/architecture/easy-fyi"

module.exports = () => {
  CNVault.getInstance().getSecrets([EASY_FYI_SECRET_PATH])
      .then(([secrets]) => {
        console.log(secrets["github-private-key"]);
      })
}

module.exports()
