// This is a sequelize file, specificially to convert node-config to what sequelize-cli expects

let config = require('config')
let env = process.env.NODE_ENV || 'development'

module.exports = {
  [env]: config.get(`database`)
}
