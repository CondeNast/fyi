const Fyi = require('../../../models').Fyi
const messaging = require('../../../messaging')

module.exports = async (request, response) => {
  let fyis = await Fyi.findAll({
    limit: 5,
    where: {confluenceApiData: {$ne: null}},
    order: [[ 'createdAt', 'DESC' ]]
  })

  let contents = await Promise.all(fyis.map((fyi) => Promise.all([fyi, fyi.confluenceContent])))
  contents = contents.map(([fyi, c]) => {
    return {
      title: c.title,
      body: c.body.storage.value,
      viewLink: fyi.viewLink
    }
  })

  response.send(messaging.digest({
    fyis: contents,
    subject: `Welcome ${contents.map((c) => c.title).join(', ')} 👋`
  }))
}
