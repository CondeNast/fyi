'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Fyis', 'repos', {
      type: Sequelize.ARRAY(Sequelize.STRING(200)),
      defaultValue: []
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Fyis', 'repos')
  }
};
