var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../model/User');
const Download = require('../model/download');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var request = require('request');
var md5 = require('md5');
var mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');
var app = express();


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});



router.get('/', function(req, res) {

  Download.find({}, function(err, obj) {
    res.json(obj);
  });

});


router.post('/:tag/', function(req, res) {

  var data = req.body.data;
  console.log(data);

  //  return res.json(data);

  if (data && data.posts && data.posts.length > 0) {


    var posts = data.posts;
    var downlodItems = [];
    console.log(posts);


    posts.forEach(function(post) {



      var downloadObj = {};

      if (post.title) {
        downloadObj.title = post.title;
      }
      if (post.id) {
        downloadObj.fileId = post.id;
      }

      var imagesObj = post.images;


      if (imagesObj && (imagesObj.image460svwm || imagesObj.image460sv)) {

        downloadObj.url = imagesObj.image460svwm.url || imagesObj.image460sv.url;
      }

      if (!downloadObj.url) {
        return
      }


      /*  imagesObj.forEach(function(obj) {

          if (obj == image460svwm || obj === image460svwm) {
            downloadObj.url = posts.images.image460svwm.url || posts.images.image460sv.url;
          }


        });

        if (!downloadObj.url) {
          console.log("empty");
          return
        }*/
      var tagItems = []
      if (post.tags && post.tags.length > 0) {

        post.tags.forEach(function(obj) {
          tagItems.push("#" + obj.key);
        });
      }
      downloadObj.tags = tagItems;
      downloadObj.upload = 0;
      downloadObj.download = 0;
      downlodItems.push(downloadObj);
    });


    Download.insertMany(downlodItems, function(err, resp) {

      if (err) {
        return res.json(err);
      }

      res.json({
        data: resp
      })
    });



  } else {


    res.json({
      msg: "failed"
    })
  }

  //var download=new Download({})



});




module.exports = router;