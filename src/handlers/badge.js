const confluence = require('../services/confluence')
const badge = require('gh-badges')
const Fyi = require('../models').Fyi
const format = {
  text: ['fyi', 'passed'],
  colorscheme: 'green',
  template: 'flat'
}
module.exports = async (request, response) => {
  if (!request.params.name) return

  let fyiName = request.params.name

  if( fyiNameIsReallyAnID(fyiName) ){
   let fyi = await Fyi.findById(fyiName)
   fyiName = fyi.name
  }

  const isFyiWritten = await confluence.isFyiWritten(fyiName)
  format.text[0] = `FYI for ${fyiName}`
  format.text[1] = isFyiWritten ? 'passed' : 'failed'
  format.colorscheme = isFyiWritten ? 'green' : 'red'
  await badge(format, (svg) => {
    response.setHeader('content-type', 'image/svg+xml')
    response.status(200).send(svg)
  })
}
function fyiNameIsReallyAnID(fyiName){
  return !Number.isNaN(parseInt(fyiName))
}
