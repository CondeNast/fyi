const CNVault = require('../scripts/vault')
const rp = require('request-promise-native')
const config = require('config')

module.exports = {
  createNewPage,
  doForEachFYIFromConfluence,
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

async function doForEachFYIFromConfluence(handleFyi){
  let promises = [];
  let data = await get('https://cnissues.atlassian.net/wiki/rest/api/content/123212691/child/page?expand=body.storage&limit=20')
  promises.concat(data.results.map(handleFyi))
  
  while(data._links.next) {
    data = await get('https://cnissues.atlassian.net/wiki'+data._links.next)
    promises.concat(data.results.map(handleFyi))
  }
  return Promise.all(promises)
}


