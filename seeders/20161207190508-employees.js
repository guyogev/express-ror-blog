'use strict';

function createEmployee(index) {
  var now = new Date();
  return { 
    active: Math.random() > .5, // randomize active == true OR false
    name: "name-"+index,
    createdAt: now,
    updatedAt: now
  }
}

function generateEmployees () {
  var i;
  var employees = [];
  for (i = 0; i < 100; i++) {
    employees.push(createEmployee(i));
  }
  return employees;
}

module.exports = {
  // insert 100 employees to db
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Employees', generateEmployees(), {});
  },

  // delete ALL employees from db
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Employees', null, {});
  }
};
