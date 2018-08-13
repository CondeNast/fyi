const confluence = require('../services/confluence')
const Fyi = require('../models').Fyi
module.exports = async (request, response) => {
  if (!request.params.name) return

  let fyiName = request.params.name
  if( fyiNameIsReallyAnID(fyiName) ){
   let fyi = await Fyi.findById(fyiName)
   fyiName = fyi.name
  }
  const fyiLink = await confluence.getFyiLink(fyiName)
  response.redirect(fyiLink)
}

function fyiNameIsReallyAnID(fyiName){
  return !Number.isNaN(parseInt(fyiName))
}
