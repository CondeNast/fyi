const Fyi = require('../../../models').Fyi

module.exports = async (request, response) => {
  let fyiId = request.params.id

  try {
    let fyi = await Fyi.findById(fyiId)
    let children = await Promise.all(await getSecondLevel(fyi.dependencies.fyis))
    response.send(JSON.stringify({
      name: fyi.name,
      tags: fyi.tags,
      link: fyi.viewLink,
      // children: fyi.dependencies.fyis.map((dep) => {
        // return {name: dep}
      // }),
      children: children
    }))
  } catch (e) {
    throw e
  }
}

async function getSecondLevel (children) {
  return children.map(async (dep) => {
    let [fyi] = await Fyi.findOrCreate({where: {name: dep}})
    return {
      name: dep,
      link: fyi.viewLink,
      children: fyi.dependencies.fyis.map((dep) => {
        return {name: dep}
      })
    }
  })
}
