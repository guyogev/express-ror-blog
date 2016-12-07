'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Employees',
      'OfficeId',
      Sequelize.INTEGER
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Employees', 'OfficeId')
  }
};
