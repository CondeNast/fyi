const Fyi = require('../../models').Fyi

module.exports = async (request, response) => {
  let fyiName = request.params.fyiName

  try {
    let fyis = await Fyi.findAll({
      where: {
        name:{
          [Fyi.sequelize.Op.ne]: null
        }
      }
    })
    response.send(JSON.stringify({
      fyis: fyis.map((e) => e.name)
    }))
  } catch(e) {
    return response.send(JSON.stringify({error: e.message, success: false}))
  }

}


