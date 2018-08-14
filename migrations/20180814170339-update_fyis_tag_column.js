'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Fyis', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING(32)),
      defaultValue: []
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Fyis', 'tags')
  }
};
