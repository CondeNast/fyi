const Fyi = require('../../models').Fyi

module.exports = async (request, response) => {
  let fyiName = request.params.fyiName

  try {
    let [fyi, created] = await Fyi.findOrCreate({where: {name:fyiName}})
    response.send(JSON.stringify({
      name: fyiName,
      children: fyi.dependencies.fyis.map((dep) => {
        return {name: dep}
      }),
      dependsOn: fyi.dependencies.fyis.map((dep) => {
        return dep
      })
    }))
  } catch(e) {
    response.send(JSON.stringify({error: e.message, success: false}))
  }

}
