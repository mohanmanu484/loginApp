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
  createdTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Poem', PoemSchema);