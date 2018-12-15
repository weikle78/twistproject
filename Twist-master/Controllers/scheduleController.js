const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var mongoose = require('mongoose');
var Schedule = require('../models/Schedule');
var School = require('../models/highschool');
//var Participant = require('../models/Participant');

var async = require('async');

// Display list of all schedules.
exports.schedule_list = function(req, res, next) {

    Schedule.find({}, 'Schedule')
      .populate('schedule')
      .exec(function (err, list_schedules) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('schedule_list', { title: 'schedule List', schedule_list: list_schedules });
      });

  };

  // Display detail page for a specific schedule.
  exports.schedule_detail = function(req, res) {
      res.send('NOT IMPLEMENTED: schedule detail: ' + req.params.id);
  };

  // Display schedule create form on GET.
  exports.schedule_create_get = function(req, res) {
      res.send('NOT IMPLEMENTED: schedule create GET');
  };

  // Handle schedule create on POST.
  exports.schedule_create_post = function(req, res) {
      res.send('NOT IMPLEMENTED: schedule create POST');
  };

  // Display schedule delete form on GET.
  exports.schedule_delete_get = function(req, res) {
      res.send('NOT IMPLEMENTED: schedule delete GET');
  };

  // Handle schedule delete on POST.
  exports.schedule_delete_post = function(req, res) {
      res.send('NOT IMPLEMENTED: schedule delete POST');
  };

  // Display schedule update form on GET.
  exports.schedule_update_get = function(req, res) {
      res.send('NOT IMPLEMENTED: schedule update GET');
  };

  // Handle schedule update on POST.
  exports.schedule_update_post = function(req, res) {
      res.send('NOT IMPLEMENTED: schedule update POST');
  };
