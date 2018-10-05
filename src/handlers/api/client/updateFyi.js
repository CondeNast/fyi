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
      let [fyi] = await Fyi.findOrCreate({where: {name: data.name}})

      if(data.dependencies.fyis) {
        fyi.dependencies = data.dependencies
      }

      if(data.repositories) {
        fyi.repos = data.repositories
      }

      if(data.tags) {
        fyi.tags = data.tags
      }

      await fyi.save()
      response.send(JSON.stringify({success: true}))
    } catch (e) {
      return response.send(JSON.stringify({error: e.message, success: false}))
    }
  })
}
