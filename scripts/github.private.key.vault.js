const CNVault = require('./vault')

module.exports = () => {
  CNVault.then((secrets) => {
    console.log(secrets['github-private-key'])
  })
}

module.exports()
