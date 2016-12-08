var express = require('express');
var router = express.Router();
var db = require('../models')
/* GET home page. */
router.get('/', function(req, res, next) {
  db.Office.findOne({
    where: {name: 'office 1'},
    include: [ db.Employee ]
  }).then(function(offices) {
    console.log('hello')
    var test = 4;
    debugger
    res.render('index', {
      title: 'Sequelize: Express Example',
      offices: offices
    });
  });
});

module.exports = router;
