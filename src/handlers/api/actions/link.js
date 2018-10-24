const confluence = require('../../../services/confluence')
const Fyi = require('../../../models').Fyi
module.exports = {
  linkByName: async (request, response) => {
    if (!request.params.name) return

    let fyiName = request.params.name

    const fyiLink = await confluence.getFyiLink(fyiName)
    response.redirect(fyiLink)
  },
  linkById: async (request, response) => {
    if (!request.params.id) return

    let fyiId = request.params.id
    let fyi = await Fyi.findById(fyiId)
    const fyiLink = await confluence.getFyiLink(fyi.name)
    response.redirect(fyiLink)
  }
}
