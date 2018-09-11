'use strict'

var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(__filename)
var env = process.env.NODE_ENV || 'development'
var config = require('config').database
var db = {}

var sequelize = new Sequelize(config.database, config.username, config.password, config)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
  db[modelName].first = () => {
    return db[modelName].findAll({
      limit: 1,
      order: [['createdAt', 'DESC']]
    }).then(([fyi]) => fyi)
  }
  db[modelName].last = () => {
    return db[modelName].findAll({
      limit: 1,
      order: [['createdAt', 'ASC']]
    }).then(([fyi]) => fyi)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
sequelize.authenticate().then(() => {}, (e) => {
  if (env === 'development') {
    throw new Error(`You don't seem to have your database setup correctly.  Here is your db config\n\n\n${JSON.stringify(config, null, 4)}`)
  }
})

module.exports = db
