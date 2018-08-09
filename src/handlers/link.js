const confluence = require('../services/confluence')
module.exports = async (request, response) => {
  if(!request.params.name) return

  let fyiName = request.params.name
  const fyiLink = await confluence.getFyiLink(fyiName) || '/'
  response.redirect(fyiLink)
}
