let dogapi = require("dogapi");
let options = {
 api_key: "", //TODO VAULT
 app_key: "", //TODO VAULT
};
dogapi.initialize(options);

module.exports = async ({org, repo}) => {
  return new Promise((resolve, reject) => {
    let now = parseInt(new Date().getTime() / 1000);
    let then = now - (48 * 3600); // a day ago
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
      let allDeployEvents = res.events.filter(e => e.title.startsWith('Deployment') && e.title.includes('__PRODUCTION'))
      let appDeployEvents = allDeployEvents.filter(e => e.text.includes(buildName))
      resolve(appDeployEvents)
    })
  }).then((events) => {
    return events
  })
}
