var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ScheduleSchema = new Schema(
  {
    SessionNum: {type: String, required: true, max: 100},
    RoomNum: {type: String, required: true, max: 100},
    TopicCode: {type: String, required: true, max: 100},
    PresenterID: {type: String, required: true, max: 100},
    }
);



// Virtual for schedule's URL
ScheduleSchema
.virtual('url')
.get(function () {
  return '/admin/schedule/' + this._id;
});

//Export model
module.exports = mongoose.model('Schedule', ScheduleSchema);

