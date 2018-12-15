
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');

var async = require('async');

var Session = require('../models/session');
//var School = require('../models/highschool');
//var Participant = require('../models/participant');



//display all sessions
exports.session_list = function(req, res, next) {

  Session.find({}, 'SessionNum')
    //.populate('SessionNum PresenterID')
    .exec(function (err, list_sessions) {
      if (err) { return next(err); }
      //successful, so render
      res.render('session_list', { title: 'Session List', session_list: list_sessions});
    });
};

// Display detail page for a specific session.
exports.session_detail = function(req, res, next) {

  Session.findById(req.params.id)
  .exec(function (err, session) {
    if (err) { return next(err); }
    if (Session==null) { // No results.
        var err = new Error('Session not found');
        err.status = 404;
        return next(err);
      }
    // Successful, so render.
    res.render('session_detail', { title: 'Session:', session: session});
  })

};

// Display session create form on GET.
exports.session_create_get = function(req, res) {
    res.render('session_form', { title: 'Create Session' });
};

// Handle session create on POST.
exports.session_create_post =  [
    // Convert the school to an array.
    (req, res, next) => {
        if(!(req.body.session instanceof Array)){
            if(typeof req.body.session==='undefined')
            req.body.session=[];
            else
            req.body.session=new Array(req.body.session);
        }
        next();
    },

    // Validate fields.
    body('SessionNum', 'SessionNum must not be empty.').isLength({ min: 1 }).trim(),
    body('PresenterID', 'PresenterID must not be empty.').isLength({ min: 1 }).trim(),
    body('Time', 'Time must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Participant object with escaped and trimmed data.
        var session = new Session(
          { SessionNum: req.body.SessionNum,
            PresenterID: req.body.PresenterID,
            Time: req.body.Time,
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all schools for form.
            async.parallel({
                sessions: function(callback) {
                    session.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected schools as checked.
                for (let i = 0; i < results.session.length; i++) {
                    if (session.SessionNum.indexOf(results.session[i]._id) > -1) {
                        results.sessions[i].checked='true';
                    }
                }
                res.render('sesssion_form', { title: 'Create Session',sessions:results.sessions, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save participant.
            session.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new participant record.
                   res.redirect(session.url);
                });
        }
    }
];
// Display session delete form on GET.
exports.session_delete_get = function(req, res, next) {

    async.parallel({
        session: function(callback) {
            Session.findById(req.params.id).exec(callback)
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.session==null) { // No results.
            res.redirect('/admin/session');
        }
        // Successful, so render.
        res.render('session_delete', { title: 'Delete Session', session: results.session } );
    });

};

// Handle session delete on POST.
exports.session_delete_post = function(req,res,next) {

    // Assume valid Topic id in field.
    Session.findByIdAndRemove(req.body.SessionNum, function deleteSession(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of topics.
        res.redirect('/admin/session');
    });
};

// Display session update form on GET.
exports.session_update_get = function(req, res, next) {

    Session.findById(req.params.id, function(err, session) {
        if (err) { return next(err); }
        if (session==null) { // No results.
            var err = new Error('Session not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('session_form', { title: 'Update Session', session: session });
    });

};

// Handle session update on POST.
exports.session_update_post = [

    // Validate that the name field is not empty.
    body('SessionNum', 'Session SessionNum required').isLength({ min: 1 }).trim(),
    body('PresenterID', 'Session PresenterID required').isLength({ min: 1 }).trim(),
    body('Time', 'Session Time required').isLength({ min: 1 }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('SessionNum').trim().escape(),
    sanitizeBody('PresenterID').trim().escape(),
    sanitizeBody('Time').trim().escape(),

     // Sanitize fields (using wildcard).
     sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a school object with escaped and trimmed data (and the old id!)
        var session = new Session(
            {
                SessionNum: req.body.SessionNum,
                PresenterID: req.body.PresenterID,
                Time: req.body.Time,
                _id:req.params.id //This is required, or a new ID will be assigned!
               });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('session_form', { title: 'Update Session', session: session, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Session.findByIdAndUpdate(req.params.id, session, {}, function (err,thesession) {
                if (err) { return next(err); }
                   // Successful - redirect to school detail page.
                   res.redirect(thesession.url);
                });
        }
    }
];

