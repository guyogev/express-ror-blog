'use strict';

var db = require('../models/index');

function createEmployee(index) {
  return { 
    active: Math.random() > .5, // randomize active == true OR false
    name: "bulk-name-"+index
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

var employees = generateEmployees();

var offices = [
  { 
    active: true,
    name: "office 3"
  },
  { 
    active: true,
    name: "office 4"
  }
]

var pets = [
  { 
    active: true,
    name: "lucky"
  },
  { 
    active: true,
    name: "flipper"
  }
]

db.Employee.destroy({where: {}}).then(function () {});
db.Office.destroy({where: {}}).then(function () {});

db.Employee.bulkCreate(employees);
db.Pet.bulkCreate(pets);
db.Office.bulkCreate(offices);
db.Office.findOne({where: { name: 'office 3' }})
  .then(function(office) {
      return db.Employee.update(
        { OfficeId: office.id },
        {where: {active: {$eq: true}}}
      )
  })

db.Employee.findOne({where: { name: 'bulk-name-1' }})
  .then(function(employee) {
      return db.Pet.update(
        { EmployeeId: employee.id },
        {where: {active: {$eq: true}}}
      )
  })

