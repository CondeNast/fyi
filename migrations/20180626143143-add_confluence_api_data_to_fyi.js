'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Fyis', 'confluenceApiData', {
      type: Sequelize.JSON
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Fyis', 'confluenceApiData')
  }
}
