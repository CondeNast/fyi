'use strict';
module.exports = (sequelize, DataTypes) => {
  var Fyi = sequelize.define('Fyi', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    originalId: DataTypes.INTEGER,

  });
  return Fyi;
};
