'use strict';

var offices = [
  { 
    active: true,
    name: "office 1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    active: true,
    name: "office 2",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

module.exports = {
  // insert 2 offices to db
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Offices', offices, {});
  },
  // delete ALL offices
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Offices', null, {});
  }
};
