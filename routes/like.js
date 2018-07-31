var express = require('express');
var router = express.Router();
const Poem = require('../model/View');
var bodyParser = require('body-parser');
var app = express();
var redis = require('redis');


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

router.post('/poems', urlencodedParser, function(req, res, next) {
  var poem = new Poem(req.body);
  poem.save(req.body, function(err, poem) {
    if (err) {
      return res.json(err);
    }
    res.json(poem);
  })
});


module.exports = router;