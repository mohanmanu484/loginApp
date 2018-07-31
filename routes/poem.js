var express = require('express');
var router = express.Router();
const Poem = require('../model/Poem');
const View = require('../model/View');
const User = require('../model/User');
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


router.post('/poems/:poemId/comments', function(req, res, next) {

  var comment = {
    "by": req.body.by,
    "body": req.body.body
  };
  Poem.findOneAndUpdate({
    _id: req.params.poemId
  }, {
    $push: {
      comments: comment
    }
  }, {
    new: true
  }, function(err, comment) {
    if (err) {
      return res.json(err);
    }
    res.json(comment)
  });
});

router.delete('/poems/:poemId/comments/:commentId', function(req, res, next) {

  var comment = {
    "_id": req.params.commentId
  };
  Poem.findOneAndUpdate({
    _id: req.params.poemId
  }, {
    $pull: {
      comments: comment
    }
  }, {
    new: true
  }, function(err, comment) {
    if (err) {
      return res.json(err);
    }
    res.json(comment)
  });
});

router.put('/poems/:poemId/comments/:commentId', function(req, res, next) {

  Poem.findOneAndUpdate({
    "_id": req.params.poemId,
    "comments._id": req.params.commentId
  }, {
    $set: {
      "comments.$.body": req.body.body
    }
  }, {
    new: true
  }, function(err, comment) {
    if (err) {
      return res.json(err);
    }
    res.json(comment)
  });
});
/*
Person.update({'items.id': 2}, {'$set': {
    'items.$.name': 'updated item2',
    'items.$.value': 'two updated'
}},
*/




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
      return res.json(err);
    }
    res.json(poem);
  })
});
//{$addToSet:{"poems":ObjectId("5b5827d38f3ac6e964578fba")}
router.post('/poems/:poemId/likes', urlencodedParser, function(req, res, next) {



  View.findOneAndUpdate({
    _id: req.params.poemId
  }, {
    $addToSet: {
      "views": req.body.userId
    }
  }, {
    new: true,
    upsert: true
  }, function(err, view) {

    if (err) {
      return res.json(err);
    }

    res.json(view);

  });



  /*console.log(req.body.userId);
  User.findOne({
    _id: req.body.userId
  }, function(err, user) {

    if (err) {
      return res.json(err);
    }

    if (user == null) {
      return console.log("user is null");
    }

    console.log(user);

    View.update({
      "_id": req.params.poemId
    }, {
      $addToSet: {
        "views": user._id
      }
    }, {
      new: true,
      upsert: true
    }, function(err, comment) {
      if (err) {
        return res.json(err);
      }
      res.json(comment)
    });
  })*/
});


router.get('/poems/:poemId/likes', urlencodedParser, function(req, res, next) {

  View.find({
    "_id": req.params.poemId
  }, function(err, comment) {
    if (err) {
      return res.json(err);
    }
    res.json(comment)
  });
});


module.exports = router;