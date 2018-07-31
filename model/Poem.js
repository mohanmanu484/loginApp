var mongoose = require('mongoose');
const comment = require('./comment.js');
var Schema = mongoose.Schema;
var CommentSchema = mongoose.model('Comment').schema;
var PoemSchema = Schema({
  title: String,
  text: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  views: Number,
  likes: Number,
  comments: [CommentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Poem', PoemSchema);