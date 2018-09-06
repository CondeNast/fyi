let dogapi = require("dogapi");
const config = require('config')

let options = {
  api_key: config.get('datadog.apiKey'),
  app_key: config.get('datadog.appKey')
}

dogapi.initialize(options);

module.exports = async ({org, repo}) => {
  return new Promise((resolve, reject) => {
    let now = parseInt(new Date().getTime() / 1000);
    let then = now - (24 * 3600); // a day ago
    let parameters = {
      tags: "puppetrole:kubernetes",
      sources: "apps"
    };

    let buildName = `${org.toLowerCase()}_${repo.toLowerCase()}`
    dogapi.event.query(then, now, parameters, (err, res) => {
      if(err) {
        console.log(err)
        return []
      }
      let prodDeployEvents = res.events.filter(
        e => e.title.startsWith('Deployment') && e.title.includes('__PRODUCTION') && e.text.includes(buildName)
      )
      let nonprodDeployEvents = res.events.filter(
        e => e.title.startsWith('Deployment') && e.title.includes('__NONPRODUCTION') && e.text.includes(buildName)
      )

      resolve({prodDeployEvents, nonprodDeployEvents})
    })
  }).then((events) => {
    return events
  })
}
