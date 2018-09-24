const Fyi = require('../../../models').Fyi

module.exports = async (request, response) => {
  let fyiId = request.params.id

  try {
    let fyi = await Fyi.findById(fyiId)
    let children = await Promise.all(await getSecondLevel(fyi.dependencies.fyis))
    response.send(JSON.stringify({
      fyiId: fyi.id,
      name: fyi.name,
      tags: fyi.tags,
      link: fyi.viewLink,
      children: children
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
        return {name: dep, fyiId: dep.id}
      })
    }
    return {
      name: dep,
      fyiId: fyi.id,
      link: fyi.viewLink,
      children: newChildren
    }
  })
}
