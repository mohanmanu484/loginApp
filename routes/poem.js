var express = require('express');
var router = express.Router();
const Poem = require('../model/Poem');
var bodyParser = require('body-parser');
var app = express();


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

router.post('/poems/:id',
  passport.authenticate('basic', {
    session: false
  }),
  function(req, res) {
    console.log(req.user);
    res.json(req.user);
  });

router.get('/poems', urlencodedParser, function(req, res) {

  Poem.find({}, function(err, resp) {

    if (err) {
      console.log(err);
      return;
    }
    res.json(resp);

  });


});

router.post('/register', urlencodedParser, function(req, res, next) {

  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (user == null) {
      var userObj = new User(req.body);
      User.createUser(userObj, function(saveErr, user) {
        if (saveErr) {
          res.send(saveErr);
          return
        }
        res.json({
          msg: "user created",
          user: user
        });
      });
    } else {
      res.json({
        msg: "User already registered"
      })
    }
  });
});

module.exports = router;