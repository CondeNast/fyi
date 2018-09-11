const confluence = require('../../../services/confluence')
const badge = require('gh-badges')
const Fyi = require('../../../models').Fyi
const format = {
  text: ['fyi', 'passed'],
  colorscheme: 'green',
  template: 'flat'
}
module.exports = {
  badgeByName: async (request, response) => {
    if (!request.params.name) return

    let fyiName = request.params.name

    const isFyiWritten = await confluence.isFyiWritten(fyiName)
    format.text[0] = `FYI for ${fyiName}`
    format.text[1] = isFyiWritten ? 'passed' : 'failed'
    format.colorscheme = isFyiWritten ? 'green' : 'red'
    await badge(format, (svg) => {
      response.setHeader('content-type', 'image/svg+xml')
      response.status(200).send(svg)
    })
  },
  badgeById: async (request, response) => {
    if (!request.params.id) return

    let fyiId = request.params.id
    let fyi = await Fyi.findById(fyiId)
    let fyiName = fyi.name

    const isFyiWritten = await confluence.isFyiWritten(fyiName)
    format.text[0] = `FYI for ${fyi.name}`
    format.text[1] = isFyiWritten ? 'passed' : 'failed'
    format.colorscheme = isFyiWritten ? 'green' : 'red'
    await badge(format, (svg) => {
      response.setHeader('content-type', 'image/svg+xml')
      response.status(200).send(svg)
    })
  }
}
