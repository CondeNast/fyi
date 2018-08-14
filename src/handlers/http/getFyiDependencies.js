const Fyi = require('../../models').Fyi

module.exports = async (request, response) => {
  let fyiName = request.params.fyiName

  try {
    let [fyi, created] = await Fyi.findOrCreate({where: {name: fyiName}})
    let children = await Promise.all(await getSecondLevel(fyi.dependencies.fyis))
    response.send(JSON.stringify({
      name: fyiName,
      link: fyi.viewLink,
      // children: fyi.dependencies.fyis.map((dep) => {
        // return {name: dep}
      // }),
      children: children
    }))
  } catch (e) {
    throw e
    response.send(JSON.stringify({error: e.message, success: false}))
  }
}

async function getSecondLevel (children) {
  return children.map(async (dep) => {
    let [fyi, created] = await Fyi.findOrCreate({where: {name: dep}})
    return {
      name: dep,
      link: fyi.viewLink,
      children: fyi.dependencies.fyis.map((dep) => {
        return {name: dep}
      })
    }
  })
}
