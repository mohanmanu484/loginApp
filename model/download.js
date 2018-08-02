var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;




var DownloadSchema = Schema({
  url: String,
  title: String,
  fileId: String,
  categoryTitle: String,
  tags: [String],
  download: Number,
  upload: Number,
}, {
  timestamps: true
});

DownloadSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Download', DownloadSchema);