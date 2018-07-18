'use strict'
module.exports = (sequelize, DataTypes) => {
  var System = sequelize.define('System', {
    name: DataTypes.STRING,
    fyi_id: DataTypes.INTEGER,
    repo_url: DataTypes.STRING,
    slack_channel: DataTypes.STRING,
    main_point_of_contact: DataTypes.STRING
  }, {})
  System.associate = function (models) {
    System.belongsTo(models.Fyi, {foreign_key: 'fyi_id'})
  }
  return System
}
