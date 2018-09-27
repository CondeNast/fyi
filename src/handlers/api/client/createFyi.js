const Fyi = require('../../../models').Fyi

module.exports = async (request, response) => {
  const dataChunks = []
  request.on('error', (error) => {
    response.statusCode = 500
    response.end(error.toString())
  })

  request.on('data', (chunk) => {
    dataChunks.push(chunk)
  })
  request.on('end', async () => {
    const payload = Buffer.concat(dataChunks).toString()
    let data
    try {
      data = JSON.parse(payload)
      let fyiName = data.fyiName
      console.log(`loading fyi model for ${fyiName} ...`)
      let [fyi] = await Fyi.findAll({limit: 1, where: {name: fyiName}})
      let isExistingFyi
      if (fyi) {
        isExistingFyi = true
      } else {
        isExistingFyi = false
        fyi = await Fyi.forName(fyiName)
      }
      console.log(`fyi model loaded`)
      return response.send(JSON.stringify({success: !isExistingFyi, fyiId: fyi.id}))
    } catch (e) {
      return response.send(JSON.stringify({error: e.message, success: false}))
    }
  })
}
