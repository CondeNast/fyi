const Fyi = require('../../models').Fyi

module.exports = async (request, response) => {
  let fyiName = request.params.fyiName

  try {
    let systems = await getFyisByTag("system")
    let all = await getFyisByTag()
    response.send(JSON.stringify({
      systems: systems.map((e) => e.name),
      all: all.map((e) => e.name)
    }))
  } catch (e) {
    return response.send(JSON.stringify({error: e.message, success: false}))
  }
}



async function getFyisByTag(...tags) {
  let fyis = await Fyi.findAll({
    where: {
      name:{
        [Fyi.sequelize.Op.ne]: null
      },
      tags: { $contains: tags }
    }
  })
  return fyis

}
