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
        if(this.confluenceApiData) {
          return this.confluenceApiData._links.base + this.confluenceApiData._links.webui
        }
        else {
          return "/"
        }
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
      await fyi.save()
    }
    return fyi
  }

  Fyi.loadFromConfluence = async function () {
    return confluence.doForEachFYIFromConfluence(async function(res){
      let [fyi, created] = await Fyi.findOrCreate({where: {name: res.title}})
      if (created) {
        fyi.confluenceApiData = await confluence.get(res._links.self)
        fyi.save()
      }

      return fyi
    })
  }

  return Fyi
}
