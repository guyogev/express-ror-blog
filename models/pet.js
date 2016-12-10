'use strict';
module.exports = function(sequelize, DataTypes) {
  var Pet = sequelize.define('Pet', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    EmployeeId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Pet.belongsTo(models.Employee)
      }
    }
  });
  return Pet;
};