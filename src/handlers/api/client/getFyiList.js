const Fyi = require('../../../models').Fyi

module.exports = async (request, response) => {
  try {
    let systems = await getFyisByTag('system')
    let all = await getFyisByTag()
    response.send(JSON.stringify({
      systems: systems.map((fyi) => ({
        id: fyi.id,
        name: fyi.name,
        content: fyi.content,
        contentIntro: fyi.contentIntro,
        createdAt: fyi.createdAt,
        tags: fyi.tags
      })),
      all: all.map((fyi) => ({
        id: fyi.id,
        name: fyi.name,
        contentIntro: fyi.contentIntro
      }))
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
