
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SessionSchema = new Schema(
  {
    SessionNum: {type:String, required: true, max:100},
    PresenterID: {type:String, required: true, max:100},
    Time: {type: Date}

});

// Virtual for school's name
SessionSchema
.virtual('name')
.get(function () {
  return this.SessionNum;
});




// Virtual for session's URL
SessionSchema
.virtual('url')
.get(function () {
  return '/admin/session/' + this._id;
});

//Export model
module.exports = mongoose.model('Session', SessionSchema);
