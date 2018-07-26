const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const User = new Schema({
  email: {
    type: String,
    index: {
      unique: true
    }
  },
  password: String,
  name: String,
  poems: [{
    type: Schema.Types.ObjectId,
    ref: 'Poem'
  }],
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: 'Poem'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Poem'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});


module.exports = mongoose.model('User', User);

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}