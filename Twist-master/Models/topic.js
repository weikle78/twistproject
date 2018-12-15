var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TopicSchema = new Schema(
  {
    topicCode: {type: String, required: true, max: 100},
    title: {type: String, required: true, max: 100},
    description: {type: String, required: true, max: 100}
  }
);

// Virtual for topics's full name
TopicSchema
.virtual('name')
.get(function () {
  return this.LastName + ', ' + this.FirstName;
});



// Virtual for topic's URL
TopicSchema
.virtual('url')
.get(function () {
  return '/admin/topic/' + this._id;
});

//Export model
module.exports = mongoose.model('Topic', TopicSchema);