const DogStatsD = require('node-dogstatsd').StatsD

module.exports = (options) => {
  const defaults = {
    prefix: 'probot',
    host: '127.0.0.1',
    port: 8120
  }
  const config = Object.assign({}, defaults, options)

  const dogstatsd = new DogStatsD(config.host, config.port)
  const METRIC = config.prefix + '.http.request.time'

  return (req, res, next) => {
    if (!req._startTime) {
      req._startTime = new Date()
    }
    const end = res.end
    res.end = (chunk, encoding) => {
      res.end = end
      res.end(chunk, encoding)
      if (!req.route || !req.route.path) {
        return
      }
      const time = new Date() - req._startTime
      const baseUrl = req.baseUrl ? req.baseUrl : ''
      const tags = []
      tags.push('method:' + req.method.toLowerCase())
      tags.push('path:' + baseUrl + req.route.path)
      tags.push('statuscode:' + res.statusCode)
      dogstatsd.histogram(METRIC, time, tags)
    }
    next()
  }
}
