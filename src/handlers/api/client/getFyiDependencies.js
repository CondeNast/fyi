const Fyi = require('../../../models').Fyi
const fetch = require('node-fetch')

module.exports = async (request, response) => {
  let fyiId = request.params.id

  try {
    let fyi = await Fyi.findById(fyiId)
    let children = await Promise.all(await getSecondLevel(fyi.dependencies.fyis))

    let deploysUrl = `${request.protocol}://${request.get('host')}/deploys`
    let deploysResponse = await fetch(`${deploysUrl}/${fyi.name}`)
    let deploys = await deploysResponse.json();

    response.send(JSON.stringify({
      name: fyi.name,
      content: fyi.content,
      link: fyi.viewLink,
      tags: fyi.tags,
      repos: fyi.repos,
      deploys,
      children
    }))
  } catch (e) {
    throw e
  }
}

async function getSecondLevel (children) {
  return children.map(async (dep) => {
    let [fyi] = await Fyi.findOrCreate({where: {name: dep}})
    let newChildren;
    if(fyi.dependencies.fyis.length !== 0){
      newChildren = await Promise.all(await getSecondLevel(fyi.dependencies.fyis))
    }
    else{
      newChildren = fyi.dependencies.fyis.map((dep) => {
        return {name: dep}
      })
    }
    return {
      name: dep,
      link: fyi.viewLink,
      children: newChildren
    }
  })
}
