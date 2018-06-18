'use strict';
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    github_project: DataTypes.STRING,
    system: DataTypes.STRING,
    event: DataTypes.STRING,
    source: DataTypes.STRING
  }, {});

  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
