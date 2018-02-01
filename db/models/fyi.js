'use strict';
module.exports = (sequelize, DataTypes) => {
  var Fyi = sequelize.define('Fyi', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    originalId: DataTypes.INTEGER,

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Fyi;
};
