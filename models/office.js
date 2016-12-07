'use strict';
module.exports = function(sequelize, DataTypes) {
  var Office = sequelize.define('Office', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Office;
};