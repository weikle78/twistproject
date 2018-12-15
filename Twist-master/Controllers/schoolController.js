const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');
var School = require('../models/highschool');
var Participant = require('../models/participant');

var async = require('async');


// Display list of all Schools.
exports.school_list = function(req, res, next) {

    School.find({})
      .exec(function (err, list_schools) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('school_list', { title: 'School List', school_list: list_schools });
      });
      
  };

  // Display detail page for a specific School.
exports.school_detail = function(req, res, next) {
	var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        school: function(callback) {
            School.findById(req.params.id)
              .exec(callback);
        },

        school_participants: function(callback) {
          Participant.find({ 'School': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.school==null) { // No results.
            var err = new Error('School not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('school_detail', { title: 'School Detail', school: results.school, school_participants: results.school_participants } );
    });

};
  
  // Display School create form on GET.
  exports.school_create_get = function(req, res, next) {     
      res.render('school_form', { title: 'Create School' });
  };
  
  // Handle School create on POST.
exports.school_create_post =  [
   
    // Validate that the HSName field is not empty.
    body('HSName', 'School HSName required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the HSName field.
    sanitizeBody('HSName').trim().escape(),
    sanitizeBody('HSID').trim().escape(),

     // Sanitize fields (using wildcard).
     sanitizeBody('*').trim().escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a School object with escaped and trimmed data.
      var school = new School(
        { HSName: req.body.HSName,
          HSID: req.body.HSID }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('school_form', { title: 'Create School', school: school, errors: errors.array()});
      return;
      }
      else {
        // Data from form is valid.
        // Check if School with same HSName already exists.
        School.findOne({ 'HSName': req.body.HSName })
          .exec( function(err, found_school) {
             if (err) { return next(err); }
  
             if (found_school) {
               // School exists, redirect to its detail page.
               res.redirect(found_school.url);
             }
             else {
  
               school.save(function (err) {
                 if (err) { return next(err); }
                 // School saved. Redirect to School detail page.
                 res.redirect(school.url);
               });
  
             }
  
           });
      }
    }
  ];
  
  // Display School delete form on GET.
exports.school_delete_get = function(req, res, next) {

    async.parallel({
        school: function(callback) {
            School.findById(req.params.id).exec(callback)
        },
        school_participants: function(callback) {
          Participant.find({ 'School': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.school==null) { // No results.
            res.redirect('/admin/school');
        }
        // Successful, so render.
        res.render('school_delete', { title: 'Delete School', school: results.school, school_participants: results.school_participants } );
    });

};

  
  // Handle School delete on POST.
exports.school_delete_post = function(req, res, next) {

    async.parallel({
        school: function(callback) {
          School.findById(req.body.schoolid).exec(callback)
        },
        school_participants: function(callback) {
          Participant.find({ 'School': req.body._id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.school_participants.length > 0) {
            // School has participants. Render in same way as for GET route.
            res.render('school_delete', { title: 'Delete School', school: results.school, school_participants: results.school_participants } );
            return;
        }
        else {
            // School has no participants. Delete object and redirect to the list of school.
            School.findByIdAndRemove(req.body.HSID, function deleteSchool(err) {
                if (err) { return next(err); }
                // Success - go to school list
                res.redirect('/admin/school')
            })
        }
    });
};
  
// Display School update form on GET.
exports.school_update_get = function(req, res, next) {

    School.findById(req.params.id, function(err, school) {
        if (err) { return next(err); }
        if (school==null) { // No results.
            var err = new Error('School not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('school_form', { title: 'Update School', school: school });
    });

};

// Handle School update on POST.
exports.school_update_post = [
   
    // Validate that the name field is not empty.
    body('HSName', 'School HSName required').isLength({ min: 1 }).trim(),
    body('HSID', 'School HSID required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('HSName').trim().escape(),
    sanitizeBody('HSID').trim().escape(),

     // Sanitize fields (using wildcard).
     sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a school object with escaped and trimmed data (and the old id!)
        var school = new School(
            { 
                HSName: req.body.HSName,
                HSID: req.body.HSID,
                _id:req.params.id //This is required, or a new ID will be assigned!
               });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('school_form', { title: 'Update School', school: school, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            School.findByIdAndUpdate(req.params.id, school, {}, function (err,theschool) {
                if (err) { return next(err); }
                   // Successful - redirect to school detail page.
                   res.redirect(theschool.url);
                });
        }
    }
];