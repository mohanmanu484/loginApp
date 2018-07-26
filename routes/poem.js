var express = require('express');
var router = express.Router();
const Poem = require('../model/Poem');
var bodyParser = require('body-parser');
var app = express();
var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
  console.log('Redis client connected');
});

client.on('error', function(err) {
  console.log('Something went wrong ' + err);
});


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

/*router.post('/poems/:id',
  passport.authenticate('basic', {
    session: false
  }),
  function(req, res) {
    console.log(req.user);
    res.json(req.user);
  });*/


router.get('/redis', function(req, res, next) {

  client.get('poem', function(error, result) {
    if (error) {
      console.log(error);
      throw error;
    }

    console.log('GET result ->' + result);
  });

});


router.get('/poems', function(req, res, next) {

  Poem.find({}, function(err, resp) {
    if (err) {
      return res.json(err);
    }
    //  client.set('poems', resp, redis.print);
    console.log("from db");
    res.json(resp);
  });


  /*  client.get('poems', function(error, result) {
      if (error) {
        console.log(error);
        throw error;
      }

      if (result != null) {
        res.json(resp);
        console.log("from cache");
      } else {
        Poem.find({}, function(err, resp) {
          if (err) {
            return res.json(err);
          }
          client.set('poems', resp, redis.print);
          console.log("from db");
          res.json(resp);
        });
      }
  });*/
});

router.get('/poems/:id', function(req, res, next) {

  Poem.findOne({
    _id: req.params.id
  }, function(err, poem) {
    if (err) {
      return res.json(err);
    }
    res.json(poem);
  });

});


router.put('/poems/:id', function(req, res, next) {
  Poem.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true
  }, function(err, poem) {
    if (err) {
      return res.json(err);
    }
    res.json(poem);
  });

});

router.post('/poems', urlencodedParser, function(req, res, next) {
  var poem = new Poem(req.body);
  poem.save(req.body, function(err, poem) {
    if (err) {
      return res.json({
        "msg": "failed"
      });
    }
    res.json(poem);
  })
});


module.exports = router;