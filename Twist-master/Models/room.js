var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoomSchema = new Schema(
  {
    RoomNumber: {type: String, required: true, max: 100},
    Building: {type: String, required: true, max: 100},
    Capacity: {type: String, required: true, max: 100},
  }
);

// Virtual for room's number
RoomSchema
.virtual('name')
.get(function () {
  return this.RoomNumber;
});



// Virtual for room's URL
RoomSchema
.virtual('url')
.get(function () {
  return '/admin/room/' + this._id;
});

//Export model
module.exports = mongoose.model('Room', RoomSchema);
