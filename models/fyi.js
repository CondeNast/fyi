'use strict'
module.exports = (sequelize, DataTypes) => {
  var Fyi = sequelize.define('Fyi', {
    name: DataTypes.STRING,
    confluenceUrl: DataTypes.STRING,
    content: DataTypes.STRING
  }, {})
  Fyi.associate = function (models) {
    // associations can be defined here
  }
  return Fyi
}
