'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Fyis', 'content', {
      type: Sequelize.STRING(32768)
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Fyis', 'content', {
      type: Sequelize.STRING(255)

    })
  }
}
