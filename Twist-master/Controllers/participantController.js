const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var School = require('../models/highschool');
var Participant = require('../models/participant');

var async = require('async');
async.parallel({
participant_count: function(callback) {
    Participant.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
}
});
// Display list of all Participants.
exports.participant_list = function(req, res, next) {

    Participant.find({})
      .exec(function (err, list_participants) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('participant_list', { title: 'Participant List', participant_list: list_participants });
      });
      
  };

 // Display detail page for a specific Participant.
exports.participant_detail = function(req, res, next) {

    Participant.findById(req.params.id)
    .populate('School')
    .exec(function (err, participant) {
      if (err) { return next(err); }
      if (participant==null) { // No results.
          var err = new Error('No school associated with participant.');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('participant_detail', { title: participant.name, participant:  participant});
    })

};
  
// Display Participant create form on GET.
exports.participant_create_get = function(req, res, next) {       

    School.find({},'HSName')
    .exec(function (err, schools) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('participant_form', {title: 'Create Participant', school_list: schools});
    });
    
};
  
 // Handle participant create on POST.
exports.participant_create_post = [
    // Convert the school to an array.
    (req, res, next) => {
        next();
    },

    // Validate fields.
    body('FirstName', 'FirstName must not be empty.').isLength({ min: 1 }).trim(),
    body('LastName', 'LastName must not be empty.').isLength({ min: 1 }).trim(),
    body('Email', 'Email must not be empty.').isLength({ min: 1 }).trim(),
    body('Address', 'Address must not be empty').isLength({ min: 1 }).trim(),
    body('ParticipantType', 'Must know the kind of Participant').isLength({ min: 1 }).trim(),
    body('School', 'Must know if attending a School').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Participant object with escaped and trimmed data.
        var participant = new Participant(
          { FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Email: req.body.Email,
            Address: req.body.Address,
            ParticipantType: req.body.ParticipantType,
            School: req.body.School
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all schools for form.
            async.parallel({
                schools: function(callback) {
                    School.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('participant_form', { title: 'Create Participant',participants:results.participants, school_list:results.schools, participant: participant, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save participant.
            participant.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new participant record.
                   res.redirect(participant.url);
                });
        }
    }
];
  
  // Display Participant delete form on GET.
exports.participant_delete_get = function(req, res, next) {

    Participant.findById(req.params.id)
    .populate('school')
    .exec(function (err, participant) {
        if (err) { return next(err); }
        if (participant==null) { // No results.
            res.redirect('/admin/participants');
        }
        // Successful, so render.
        res.render('participant_delete', { title: 'Delete Participant', participant:  participant});
    })

};
// Handle Participant delete on POST.
exports.participant_delete_post = function(req, res, next) {
    
    // Assume valid Participant id in field.
    Participant.findByIdAndRemove(req.body.id, function deleteParticipant(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of Participant items.
        res.redirect('/admin/participant');
        });

};

// Display Participant update form on GET.
exports.participant_update_get = function(req, res, next) {

    // Get school, authors and genres for form.
    async.parallel({
        participant: function(callback) {
            Participant.findById(req.params.id).populate('school').exec(callback)
        },
        schools: function(callback) {
            School.find({},callback)
        },

        }, function(err, results) {
            if (err) { return next(err); }
            if (results.participant==null) { // No results.
                var err = new Error('School copy not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('participant_form', { title: 'Update  Participant', school_list : results.schools, selected_school : results.participant.school, participant:results.participant });
        });

};

// Handle Participant update on POST.
exports.participant_update_post = [

    // Validate fields.
    body('FirstName', 'FirstName must not be empty.').isLength({ min: 1 }).trim(),
    body('LastName', 'LastName must not be empty.').isLength({ min: 1 }).trim(),
    body('Email', 'Email must not be empty.').isLength({ min: 1 }).trim(),
    body('Address', 'Address must not be empty').isLength({ min: 1 }).trim(),
    body('ParticipantType', 'Must know the kind of Participant').isLength({ min: 1 }).trim(),
    
    // Sanitize fields.
    //sanitizeBody('HSName').trim().escape(),
    sanitizeBody('*').trim().escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Participant object with escaped/trimmed data and current id.
        var participant = new Participant(
          { FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Email: req.body.Email,
            Address: req.body.Address,
            ParticipantType: req.body.ParticipantType,
            School: req.body.School,
            _id: req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors so render the form again, passing sanitized values and errors.
            School.find({},'title')
                .exec(function (err, schools) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('participant_form', { title: 'Update Participant', school_list : schools, selected_school : participant.school, errors: errors.array(), participant:participant });
            });
            return;
        }
        else {
            // Data from form is valid.
            Participant.findByIdAndUpdate(req.params.id, participant, {}, function (err,theparticipant) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                   res.redirect(theparticipant.url);
                });
        }
    }
];