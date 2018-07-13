const Fyi = require('../../models').Fyi

module.exports = async (request, response) => {
  let fyiName = request.params.fyiName

  try {
    let [fyi, created] = await Fyi.findOrCreate({where: {name:fyiName}})
    response.send(JSON.stringify({
      name: fyiName,
      children: fyi.dependencies.fyis.map((dep) => {
        return {name: dep}
      })
    }))
  } catch(e) {
    return response.send(JSON.stringify({error: e.message, success: false}))
  }

}

