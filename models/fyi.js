'use strict'
const confluence = require('../services/confluence')

module.exports = (sequelize, DataTypes) => {
  var Fyi = sequelize.define('Fyi', {
    name: DataTypes.STRING,
    confluenceUrl: DataTypes.STRING,
    confluenceApiData: DataTypes.JSON,
    dependencies: DataTypes.JSON,
    content: DataTypes.STRING
  }, {
    getterMethods: {
      editLink: function () {
        return this.confluenceApiData._links.base + this.confluenceApiData._links.editui
      },
      viewLink: function () {
        return this.confluenceApiData._links.base + this.confluenceApiData._links.webui
      },
      contentUrl: function () {
        return this.confluenceApiData._links.self + '?expand=body.storage'
      },
      confluenceContent: async function () {
        return confluence.get(this.contentUrl)
      }
    }
  })
  Fyi.associate = function (models) {
    // associations can be defined here
  }
  Fyi.forName = async function (name) {
    let [fyi, created] = await Fyi.findOrCreate({where: {name: name}})
    if (created) {
      let confluenceApiData = await confluence.createNewPage(name)
      fyi.confluenceApiData = confluenceApiData
      fyi.save()
    }
    return fyi
  }

  return Fyi
}
