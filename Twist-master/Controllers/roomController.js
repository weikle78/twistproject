const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var mongoose = require('mongoose');

var async = require('async');

var Room = require('../models/room');

// Display list of all rooms.
exports.room_list = function(req, res, next) {

    Room.find({}, 'RoomNumber')   //used to populate in _list
      .exec(function (err, list_rooms) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('room_list', { title: 'Room List', room_list: list_rooms });
      });

  };

  // Display detail page for a specific room.
  exports.room_detail = function(req, res, next) {

    Room.findById(req.params.id)
    .exec(function (err, room) {
      if (err) { return next(err); }
      if (Room==null) { // No results.
          var err = new Error('Room not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('room_detail', { title: 'Room:', room: room});
    })

};

  // Display Room create form on GET.
  exports.room_create_get = function(req, res) {
      res.render('room_form', { title: 'Create Room' });
  };

  // Handle Room create on POST.
  exports.room_create_post = [
      // Convert the school to an array.
      (req, res, next) => {
          if(!(req.body.room instanceof Array)){
              if(typeof req.body.room==='undefined')
              req.body.room=[];
              else
              req.body.room=new Array(req.body.room);
          }
          next();
      },

      // Validate fields.
      body('RoomNumber', 'RoomNumber must not be empty.').isLength({ min: 1 }).trim(),
      body('Building', 'Building must not be empty.').isLength({ min: 1 }).trim(),
      body('Capacity', 'Capacity must not be empty.').isLength({ min: 1 }).trim(),

      // Sanitize fields (using wildcard).
      sanitizeBody('*').trim().escape(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);

          // Create a Participant object with escaped and trimmed data.
          var room = new Room(
            { RoomNumber: req.body.RoomNumber,
              Building: req.body.Building,
              Capacity: req.body.Capacity,
             });

          if (!errors.isEmpty()) {
              // There are errors. Render form again with sanitized values/error messages.

              // Get all schools for form.
              async.parallel({
                  rooms: function(callback) {
                      room.find(callback);
                  },
              }, function(err, results) {
                  if (err) { return next(err); }

                  // Mark our selected schools as checked.
                  for (let i = 0; i < results.room.length; i++) {
                      if (room.RoomNumber.indexOf(results.rooms[i]._id) > -1) {
                          results.rooms[i].checked='true';
                      }
                  }
                  res.render('room_form', { title: 'Create Room',rooms:results.rooms, errors: errors.array() });
              });
              return;
          }
          else {
              // Data from form is valid. Save participant.
              room.save(function (err) {
                  if (err) { return next(err); }
                     //successful - redirect to new participant record.
                     res.redirect(room.url);
                  });
          }
      }
  ];
  // Display Room delete form on GET.
  exports.room_delete_get = function(req, res, next) {

      async.parallel({
          room: function(callback) {
              Room.findById(req.params.id).exec(callback)
          },

      }, function(err, results) {
          if (err) { return next(err); }
          if (results.room==null) { // No results.
              res.redirect('/admin/room');
          }
          // Successful, so render.
          res.render('room_delete', { title: 'Delete Room', room: results.room } );
      });

  };

  // Handle Room delete on POST.
  exports.room_delete_post = function(req,res,next) {

      // Assume valid Topic id in field.
      Room.findByIdAndRemove(req.body.RoomNumber, function deleteRoom(err) {
          if (err) { return next(err); }
          // Success, so redirect to list of topics.
          res.redirect('/admin/room');
      });
  };


  // Display Room update form on GET.
  exports.room_update_get = function(req, res, next) {

      Room.findById(req.params.id, function(err, room) {
          if (err) { return next(err); }
          if (room==null) { // No results.
              var err = new Error('Room not found');
              err.status = 404;
              return next(err);
          }
          // Success.
          res.render('room_form', { title: 'Update Room', room: room });
      });

  };
  // Handle Room update on POST.
  exports.room_update_post = [

      // Validate that the name field is not empty.
      body('RoomNumber', 'Room RoomNumber required').isLength({ min: 1 }).trim(),
      body('Capacity', 'Room Capacity required').isLength({ min: 1 }).trim(),
      body('Building', 'Room Building required').isLength({ min: 1 }).trim(),

      // Sanitize (trim and escape) the name field.
      sanitizeBody('RoomNumber').trim().escape(),
      sanitizeBody('Capacity').trim().escape(),
      sanitizeBody('Building').trim().escape(),

       // Sanitize fields (using wildcard).
       sanitizeBody('*').trim().escape(),

      // Process request after validation and sanitization.
      (req, res, next) => {

          // Extract the validation errors from a request .
          const errors = validationResult(req);

      // Create a school object with escaped and trimmed data (and the old id!)
          var room = new Room(
              {
                  RoomNumber: req.body.RoomNumber,
                  Capacity: req.body.Capacity,
                  Building: req.body.Building,
                  _id:req.params.id //This is required, or a new ID will be assigned!
                 });


          if (!errors.isEmpty()) {
              // There are errors. Render the form again with sanitized values and error messages.
              res.render('room_form', { title: 'Update Room', room: room, errors: errors.array()});
          return;
          }
          else {
              // Data from form is valid. Update the record.
              Room.findByIdAndUpdate(req.params.id, room, {}, function (err,theroom) {
                  if (err) { return next(err); }
                     // Successful - redirect to school detail page.
                     res.redirect(theroom.url);
                  });
          }
      }
  ];
