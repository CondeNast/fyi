'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Events', 'actor', {
        allowNull: false,
        defaultValue: 'archbot',
        type: Sequelize.STRING
      });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Events', 'actor');
  }
};
