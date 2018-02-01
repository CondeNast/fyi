'use strict';
const rp = require('request-promise-native');

module.exports = {
  up: async function(queryInterface, Sequelize) {
    const CNVault = require('@condenast/cn-vault');
    const CONFLUENCE_SECRET_KEY = 'secret/architecture/easy-fyi';
    const [confluenceSecrets] = await CNVault.getInstance().getSecrets([CONFLUENCE_SECRET_KEY]);

    const models = require('../models');
    const options = {
      url: 'https://cnissues.atlassian.net/wiki/rest/api/content/search?cql=parent=123212691&limit=200&expand=body.storage',
      json: true,
    }

    await models.Fyi.destroy({
        where: {},
          truncate: true
    });

    let data = await rp.get(options)
                       .auth(confluenceSecrets['confluence-username'],
                             confluenceSecrets['confluence-access-token'])
    let results = [];
    for(let fyi of data.results){
      let res = await models.Fyi.create({
          title: fyi.title,
          description: fyi.body.storage.value,
          originalId: fyi.id
      });
      results.push(res);
    }

    return Promise.all(results);

  },

  down: (queryInterface, Sequelize) => {
  }
};

async function asyncForEach(array, callback) {
  let funcs = [];
  for( let i = 0; i < array.length; i++ ){
    funcs.push( () => callback(array[i]) )  
  }
  funcs.reduce((promise, func) =>
                   promise.then(result => func().then(Array.prototype.concat.bind(result))),
                   Promise.resolve([])).then(() => {})
                   .catch(console.error.bind(console))

}
