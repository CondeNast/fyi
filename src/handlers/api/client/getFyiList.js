const Fyi = require('../../../models').Fyi

module.exports = async (request, response) => {
  try {
    let systems = await getFyisByTag('system')
    let all = await getFyisByTag()
    response.send(JSON.stringify({
      systems: systems.map((e) => ({
        id: e.id,
        name: e.name,
        content: e.content,
        createdAt: e.createdAt,
        tags: e.tags
      })),
      all: all.map((e) => ({id: e.id, name: e.name}))
    }))
  } catch (e) {
    return response.send(JSON.stringify({error: e.message, success: false}))
  }
}

async function getFyisByTag (...tags) {
  let fyis = await Fyi.findAll({
    where: {
      name: {
        [Fyi.sequelize.Op.ne]: null
      },
      tags: { $contains: tags }
    },
    order: [['name', 'ASC']]
  })
  return fyis
}
