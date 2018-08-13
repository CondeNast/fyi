'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Fyis', 'dependencies', {
      type: Sequelize.JSON,
      defaultValue: {fyis:[]}
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Fyis', 'dependencies')
  }
};
