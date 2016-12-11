var express = require('express');
var router = express.Router();
var db = require('../models')
/* GET home page. */


function showOffice(res) {
  return db.Office.findOne({
    where: {name: 'office 3'},
    include: [ db.Employee ]
  }).then(function(offices) {
    res.render('index', {
      title: 'Sequelize: Express Example',
      showData: offices
    });
  });
}

function showOfficePets(res) {
  return db.Pet.findAll({
    include: [{
      model: db.Employee,
      include: [{
        model: db.Office,
        where: {
          name: "office 3"
        },
        required: false
      }]
    }]
  }).then(function(pets) {
    res.render('index', {
      title: 'Sequelize: Express Example',
      showData: pets
    });
  })
}

router.get('/', function(req, res, next) {
  showOffice(res)
  // showOfficePets(res);
});

module.exports = router;
