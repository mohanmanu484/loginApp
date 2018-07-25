var express = require('express');
var bodyParser = require('body-parser')
const User = require('../model/User');
var router = express.Router();


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

// POST /login gets urlencoded bodies
router.post('/', urlencodedParser, function(req, res) {
  if (!req.body) return res.sendStatus(400);

  var small = new User(req.body);
  small.save(function(err) {
    if (err) return handleError(err);
    res.send({
      "saved": true
    });
  });
});

router.put('/', urlencodedParser, function(req, res) {

  if (!req.body) return res.sendStatus(400);

  User.updateOne(req.body, function(err) {
    if (err) return handleError(err);
    res.send({
      "updated": true
    });
  });
});

router.delete('/', urlencodedParser, function(req, res) {
  if (!req.body) return res.sendStatus(400);

  var small = new User(req.body);

  User.deleteOne(req.body, function(err) {
    if (err) return handleError(err);
    // deleted at most one tank document
    res.send({
      "deleted": true
    });
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, user) {

    if (err) {
      console.log("error happened ");
      return;
    }
    res.send(user);
  });
});

module.exports = router;