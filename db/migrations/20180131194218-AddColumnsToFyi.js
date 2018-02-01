'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Fyis', 'description', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Fyis', 'originalId', {
        type: Sequelize.INTEGER
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
