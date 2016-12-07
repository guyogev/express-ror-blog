'use strict';

var db = require('../models/index');

module.exports = {
  // set OfficeId to `office 1` id, for all active employees
  up: function (queryInterface, Sequelize) {
    return db.Office
     .findOne({where: { name: 'office 1' }})
     .then(function(office) {
       return db.Employee.update(
         { OfficeId: office.id },
         {where: {active: {$eq: true}}}
       )
    })
  },

  down: function (queryInterface, Sequelize) {
    // TODO
  }
};
