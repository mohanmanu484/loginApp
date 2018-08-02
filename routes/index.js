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
var app = express();


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});


var downloadPage = 1;

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


router.get('/test', function(req, res) {




});

function printLogs() {
  console.log("");
}




router.post('/login',
  passport.authenticate('basic', {
    session: false
  }),
  function(req, res) {

    var payload = {
      "name": req.user.name,
      "password": req.user.password
    };

    var aa = app.get('abcd');
    if (aa === undefined) {
      aa = 'somesecretkey';
    }
    console.log(aa);
    var token = jwt.sign(payload, aa);
    //  console.log("token " + token);
    var respObj = req.user.toObject();
    respObj.token = token;
    console.log(respObj);
    res.json(respObj);
  });


function getRandom(max) {
  return Math.floor((Math.random() * max) + 1);
}


var download = function(url, dest, callback) {

  request.get(url)
    .on('error', function(err) {
      console.log(err)
    })
    .pipe(fs.createWriteStream(dest))
    .on('close', callback);

};

var upload = function(callback) {





  Download.paginate({
    download: 1,
    upload: 0
  }, {
    limit: 1
  }, function(err, paginationObj) {


    var docs = paginationObj.docs;
    var length = docs.length;
    console.log(docs);
    console.log("length is " + length);

    if (length > 0) {

      docs.forEach(function(doc) {


        var fileName = doc.fileId || doc._id;
        console.log("file name is " + fileName);
        var ext = doc.url.split('/').pop().split('.').pop();
        var title = doc.title || "test";

        var userInfo = {
          name: "shahsi",
          user_uuid: "fa63ec51-f03e-4989-8e82-0fe72fae5d82"
        }
        var hastagsArr = ["#funny", "#whatsApp", "#whatsApp", "#glamour", "#status", "#filmy"];
        var hashtags = doc.tags.toString() || hastagsArr[getRandom(5)] + "," + hastagsArr[getRandom(5)] + "," + hastagsArr[getRandom(5)];


        var categoryArr = ["Viral", "Glamour", "Status", "Filmy", "Devotional", "Cute", "Dance"];
        var categoryTitle = doc.categoryTitle || categoryArr[getRandom(6)];


        var obj = {
          contentId: fileName,
          hashtags: hashtags,
          categoryTitle: categoryTitle,
          imageFilePath: "/storage/emulated/0/Android/data/com.coolifie/files/cooliefieVideo",
          isVideoRecordedFromApp: false,
          pixelSize: "1080x1350",
          title: title,
          user_uuid: "fa63ec51-f03e-4989-8e82-0fe72fae5d82",
          videoFilePath: "/storage/emulated/0/WhatsApp/Media/" + fileName + "." + ext,
          userInfo: userInfo
        };
        var data = JSON.stringify(obj);

        var formData = {
          // Pass a simple key-value pair

          //\"userInfo\":{\"name\":\"\",\"user_uuid\":\"fa63ec51-f03e-4989-8e82-0fe72fae5d82\"},\"user_uuid\":\"fa63ec51-f03e-4989-8e82-0fe72fae5d82\",\"videoFilePath\":\"/storage/emulated/0/WhatsApp/Media/WhatsApp Animated Gifs/VID-20180801-WA0004.mp4\"


          details: data,

          file: fs.createReadStream("public/downloads/" + fileName + "." + ext)

          // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
          // Use case: for some types of streams, you'll need to provide "file"-related information manually.
          // See the `form-data` README for more information about options: https://github.com/form-data/form-data

        };
        console.log("came here " + fileName);
        request.post({
          url: 'https://api.coolfie.io/content/',
          formData: formData,
          headers: {
            'user-uuid': 'fa63ec51-f03e-4989-8e82-0fe72fae5d82',
            //auth-token:4256d0956
            'install-referrer': 'utm_source=google-play&utm_medium=organic',
            'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.0; Moto G (4) Build/NPJS25.93-14-15)',
            'Content-Type': 'multipart/form-data'
          }
        }, function optionalCallback(err, httpResponse, body) {
          if (err) {
            return console.error('upload failed:', err);
          }
          console.log(body);
          var myObj = JSON.parse(body);
          if (myObj.status.code === 200) {

            console.log('Upload successful!  Server responded with:', body);

            Download.findOneAndUpdate({
              _id: docs._id
            }, {
              $set: {
                upload: 1
              }
            }, function(err, resp) {
              console.log(err);
              console.log(resp);
              upload(callback);
            })



          } else if (myObj.status.code === 409) {





            Download.findOneAndUpdate({
              _id: doc._id
            }, {
              $set: {
                upload: 1
              }
            }, {
              new: true
            }, function(err, resp) {
              console.log(err);
              console.log(resp);
              upload(callback);
            })

          } else {
            callback({
              msg: "Failed"
            });
          }
        });

      });


    } else {

      callback({
        msg: "success"
      })
    }

  });



}

/*
{"status": {"time": "0.333695s", "message": "OK", "code": 200, "server": "10.10.2.186"}}


*/


router.get('/upload', urlencodedParser, function(req, res) {



  upload(function(resp) {

    res.json(resp);

  });
});

router.get('/download', urlencodedParser, function(req, res, next) {



  Download.paginate({
    download: 0
  }, {
    page: downloadPage,
    limit: 1
  }, function(err, paginationObj) {

    if (err) {
      return res.json(err);
    }
    docs = paginationObj.docs;
    var size = docs.length
    var count = 0;
    //  console.log(data);
    console.log("attempting to download @ " + paginationObj.page);
    console.log("size is " + size);

    if (docs && size > 0) {

      docs.forEach(function(data) {
        //  console.log(data);
        var str = data.url;
        var filename = str.split('/').pop();
        var ext = filename.split('.').pop();

        filename = (data.fileId) + "." + ext;
        console.log('Downloading ' + filename);
        download(str, "public/downloads/" + filename, function() {
          console.log('Finished Downloading ' + filename)

          Download.findOneAndUpdate({
            url: str
          }, {
            $set: {
              download: 1
            }
          }, {
            new: true
          }, function(err, tank) {

            if (err) {
              return res.json(err);
            }

          });
          count = count + 1;
          if (count >= 1) {
            //  if (paginationObj.page <= paginationObj.pages) {
            res.redirect('http://localhost:3000/download');
            console.log("finished everything, taking next page");
            //  }
          }
          //


        });
      });





    } else {
      res.json({
        msg: "All files are downloaded"
      });
    }




    //res.json(data.length);

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