const CNVault = require('../scripts/vault')
const rp = require('request-promise-native')
const config = require('config')

module.exports = {
  createNewPageInConfluence: createNewPageInConfluence
}

async function createNewPageInConfluence (pageTitle, pageContent = '') {
  const secrets = await CNVault

  const options = {
    url: 'https://cnissues.atlassian.net/wiki/rest/api/content/',
    json: true,
    body: {
      'type': 'page',
      'title': pageTitle,
      'ancestors': [{
        'id': config.get('confluence.fyiPageId')
      }],
      'space': {
        'key': 'ARCH'
      },
      'body': {
        'storage': {
          'value': pageContent,
          'representation': 'storage'
        }
      }
    }
  }
  return rp.post(options).auth(secrets['confluence-username'], secrets['confluence-access-token'])
}
