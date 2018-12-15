var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SchoolSchema = new Schema(
  {
    HSID: {type: String, required: true, max: 100},
    HSName: {type: String, required: true, max: 100},
  }
);

// Virtual for school's name
SchoolSchema
.virtual('name')
.get(function () {
  return this.HSName;
});



// Virtual for school's URL
SchoolSchema
.virtual('url')
.get(function () {
  return '/admin/school/' + this._id;
});

//Export model
module.exports = mongoose.model('School', SchoolSchema);