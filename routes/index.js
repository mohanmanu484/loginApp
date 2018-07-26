var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../model/User');
var bodyParser = require('body-parser');
var app = express();


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

passport.use(new BasicStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({
      email: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: "User not found"
        });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
      });

    });
  }
));

function areEqual(enteredPassword, actualPassword) {
  return enteredPassword == actualPassword;
}




app.use(passport.initialize());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


router.post('/login',
  passport.authenticate('basic', {
    session: false
  }),
  function(req, res) {
    console.log(req.user);
    res.json(req.user);
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