const CNVault = require('../scripts/vault')
const rp = require('request-promise-native')
const config = require('config')
const slugify = require('@sindresorhus/slugify')

module.exports = {
  createNewPage,
  get,
  getRandomFyiObject,
  isFyiWritten,
  getFyiLink
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

async function getRandomFyiObject () {
  // CONFIG OVERRIDE: to read FYIs from prod in all envs, use the production config directly
  // let parentPageId = config.get('confluence.fyiPageId')
  let parentPageId = require('../../config/production').confluence.fyiPageId
  let {results: pages, _links: meta} = await get(`https://cnissues.atlassian.net/wiki/rest/api/content/${parentPageId}/child/page?expand=body.view&limit=200`)
  let pagesWithBody = pages.filter(p => p.body.view.value.length !== 0)
  let count = pagesWithBody.length
  let randomIndex = Math.floor(Math.random() * count)

  let randomPage = pagesWithBody[randomIndex]
  let randomFyi = {
    name: randomPage.title,
    body: randomPage.body,
    viewLink: randomPage._links.webui
  }
  let baseLink = meta.base
  randomFyi.body.view.value = (randomFyi.body.view.value).replace(/\/wiki/gm, baseLink)
  randomFyi.viewLink = `${baseLink}${randomPage._links.webui}`
  return randomFyi
}

async function isFyiWritten (fyiName) {
  let parentPageId = require('../../config/production').confluence.fyiPageId
  let {results: pages} = await get(`https://cnissues.atlassian.net/wiki/rest/api/content/${parentPageId}/child/page?expand=body.view&limit=200`)
  let fyiNameSlug = slugify(fyiName)
  let page = pages.filter(p => slugify(p.title) === fyiNameSlug)[0]
  return page && page.body.view.value.length !== 0
}

async function getFyiLink (fyiName) {
  let parentPageId = require('../../config/production').confluence.fyiPageId
  let parentSpaceKey = require('../../config/production').confluence.spaceKey
  let {results: pages, _links: meta} = await get(`https://cnissues.atlassian.net/wiki/rest/api/content/${parentPageId}/child/page?expand=body.view&limit=200`)
  let fyiNameSlug = slugify(fyiName)
  let page = pages.filter(p => slugify(p.title) === fyiNameSlug)[0]
  if (page) {
    return `${meta.base}${page._links.webui}`
  }
  return `${meta.base}/spaces/${parentSpaceKey}/pages/${parentPageId}/FYIs`
}
