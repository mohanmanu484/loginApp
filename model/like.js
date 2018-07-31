var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LikeSchema = Schema({
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Poem'
      },
      likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }],
      {
        timestamps: true
      });

    module.exports = mongoose.model('Like', ViewSchema);