const CNVault = require('../scripts/vault')
const rp = require('request-promise-native')
const config = require('config')

module.exports = {
  createNewPage,
  get
}

async function get (url) {
  const secrets = await CNVault

  const options = {
    url,
    json: true
  }
  return rp.get(options).auth(secrets['confluence-username'], secrets['confluence-access-token'])
}

async function createNewPage (pageTitle, pageContent = '') {
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
        'key': config.get('confluence.spaceKey')
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
