var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ViewSchema = Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'Poem'
  },
  views: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('View', ViewSchema);