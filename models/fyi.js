'use strict'
const confluence = require('../services/confluence')

module.exports = (sequelize, DataTypes) => {
  var Fyi = sequelize.define('Fyi', {
    name: DataTypes.STRING,
    confluenceUrl: DataTypes.STRING,
    confluenceApiData: DataTypes.JSON,
    content: DataTypes.STRING
  }, {
    getterMethods: {
      editLink: function () {
        return this.confluenceApiData._links.base + this.confluenceApiData._links.editui
      }
    }
  })
  Fyi.associate = function (models) {
    // associations can be defined here
  }
  Fyi.forRepoName = async function (repoName) {
    let [fyi, created] = await Fyi.findOrCreate({where: {name: repoName}})
    if (created) {
      let confluenceApiData = await confluence.createNewPageInConfluence(repoName)
      fyi.confluenceApiData = confluenceApiData
      fyi.save()
    }
    return fyi
  }

  return Fyi
}
