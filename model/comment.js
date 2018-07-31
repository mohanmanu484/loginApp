var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CommentSchema = Schema({
  by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  body: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);