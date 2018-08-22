'use strict'
const confluence = require('../services/confluence')
const fs = require('fs');
const csv = require('async-csv')

module.exports = (sequelize, DataTypes) => {
  var Fyi = sequelize.define('Fyi', {
    name: DataTypes.STRING,
    confluenceUrl: DataTypes.STRING,
    confluenceApiData: DataTypes.JSON,
    dependencies: DataTypes.JSON,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    repos: DataTypes.ARRAY(DataTypes.STRING),
    content: DataTypes.STRING
  }, {
    getterMethods: {
      editLink: function () {
        return this.confluenceApiData._links.base + this.confluenceApiData._links.editui
      },
      viewLink: function () {
        if (this.confluenceApiData) {
          return this.confluenceApiData._links.base + this.confluenceApiData._links.webui
        } else {
          return '/'
        }
      },
      contentUrl: function () {
        return this.confluenceApiData._links.self + '?expand=body.storage'
      },
      confluenceContent: async function () {
        return confluence.get(this.contentUrl)
      },
      confluenceId: async function () {
        if (this.confluenceApiData) {
          return this.confluenceApiData.id
        } else {
          return null
        }
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
    return confluence.doForEachFYIFromConfluence(async function (res) {
      let [fyi, created] = await Fyi.findOrCreate({where: {confluenceApiData: {id: res.id}}})
      if (created) {
        fyi.confluenceApiData = await confluence.get(res._links.self)
        fyi.name = res.title
        fyi.content = res.body.view.value
        await fyi.save()
      }

      return fyi
    })
  }

  Fyi.updateFromConfluence = async function () {
    let fyis = await Fyi.findAll({
      where: {confluenceApiData: {$ne: null}},
      // limit:5,
      order: [[ 'createdAt', 'DESC' ]]
    })

    return Promise.all(fyis.map(async (fyi) => {
      let s = await sleep(getRandomInt(500, 2000))

      let ret = fyi
      try {
        let newData = await confluence.get(fyi.confluenceApiData._links.self + '?expand=body.view')
        if (fyi.name !== newData.title || fyi.content != newData.body.view.value) {
          fyi.name = newData.title
          fyi.content = newData.body.view.value
          fyi.confluenceApiData = newData
          ret = fyi.save()
        }
      } catch (e) {
        console.error(e.message)
      }

      return ret
    }))
  }

  Fyi.loadRepoFromCSV = async function (csvFilePath) {
    let csvFile = fs.readFileSync(csvFilePath, 'utf8');
    let rows = await csv.parse(csvFile, {});
    for(const row of rows) {
      let fyiName = row[0]
      let repoPathMatch = row[1].match(/github.com\/(.*)\/pull/)
      let repoPath
      if(!repoPathMatch) {
        continue
      }
      repoPath = repoPathMatch[1]

      // console.log(fyiName, repoPath)
      let [fyi] = await Fyi.findAll({where: {name: fyiName}})
      try {
        await fyi.update(
          {'repos': sequelize.fn('array_append', sequelize.col('repos'), repoPath)},
          {'where': {'name': fyiName}}
        )
      } catch(e) {
        console.log(fyiName, e)
      }
    }
  }

  return Fyi
}

const sleep = (ms) => new Promise((resolve, reject) => setTimeout(() => resolve(true), ms))

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}
