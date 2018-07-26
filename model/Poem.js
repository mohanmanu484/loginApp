var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


var PoemSchema = Schema({
  title: String,
  text: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  views: Number,
  likes: Number,
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Poem', PoemSchema);