var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PresenterSchema = new Schema(
  {
    lastName: {type: String, required: true, max: 100},
    firstName: {type: String, required: true, max: 100},
    occupation: {type: String, required: true, max: 100},
    mainPhone: {type: String, required: true, max: 100},
    mobilePhone: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100}
  }
);

// Virtual for presenters's full name
PresenterSchema
.virtual('name')
.get(function () {
  return this.LastName + ', ' + this.FirstName;
});



// Virtual for presenter's URL
PresenterSchema
.virtual('url')
.get(function () {
  return '/admin/presenter/' + this._id;
});

//Export model
module.exports = mongoose.model('Presenter', PresenterSchema);