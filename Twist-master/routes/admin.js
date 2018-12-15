
//const { body,validationResult } = require('express-validator/check');
//const { sanitizeBody } = require('express-validator/filter');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('index', {title: 'Admin Page'});
  //res.redirect('/admin');
});

//require controller modules.
var room_controller = require('../controllers/roomController');
var school_controller = require('../controllers/schoolController');
var presenter_controller = require('../controllers/presenterController');
var schedule_controller = require('../controllers/scheduleController');
var session_controller = require('../controllers/sessionController');
var participant_controller = require('../controllers/participantController');
var topic_controller = require('../controllers/topicController');


/// School ROUTES ///

// GET request for list of all School items.
router.get('/school', school_controller.school_list);

// GET request for creating a School. NOTE This must come before routes that display school (uses id).
router.get('/school/create', school_controller.school_create_get);

// POST request for creating School.
router.post('/school/create', school_controller.school_create_post);

// GET request to delete School.
router.get('/school/:id/delete', school_controller.school_delete_get);

// POST request to delete School.
router.post('/school/:id/delete', school_controller.school_delete_post);

// GET request to update School.
router.get('/school/:id/update', school_controller.school_update_get);

// POST request to update School.
router.post('/school/:id/update', school_controller.school_update_post);

// GET request for one School.
router.get('/school/:id', school_controller.school_detail);



/// participant ROUTES ///


// GET request for list of all participant items.
router.get('/participant', participant_controller.participant_list);


// GET request for creating a participant. NOTE This must come before routes that display participant (uses id).
router.get('/participant/create', participant_controller.participant_create_get);

// POST request for creating participant.
router.post('/participant/create', participant_controller.participant_create_post);

// GET request to delete participant.
router.get('/participant/:id/delete', participant_controller.participant_delete_get);

// POST request to delete participant.
router.post('/participant/:id/delete', participant_controller.participant_delete_post);

// GET request to update participant.
router.get('/participant/:id/update', participant_controller.participant_update_get);

// POST request to update participant.
router.post('/participant/:id/update', participant_controller.participant_update_post);

// GET request for one participant.
router.get('/participant/:id', participant_controller.participant_detail);



/// presenter ROUTES ///


// GET request for list of all presenter items.
router.get('/presenter', presenter_controller.presenter_list);


// GET request for creating a presenter. NOTE This must come before routes that display presenter (uses id).
router.get('/presenter/create', presenter_controller.presenter_create_get);

// POST request for creating presenter.
router.post('/presenter/create', presenter_controller.presenter_create_post);

// GET request to delete presenter.
router.get('/presenter/:id/delete', presenter_controller.presenter_delete_get);

// POST request to delete presenter.
router.post('/presenter/:id/delete', presenter_controller.presenter_delete_post);

// GET request to update presenter.
router.get('/presenter/:id/update', presenter_controller.presenter_update_get);

// POST request to update presenter.
router.post('/presenter/:id/update', presenter_controller.presenter_update_post);

// GET request for one presenter.
router.get('/presenter/:id', presenter_controller.presenter_detail);




/// topic ROUTES ///////////////////////////////////////////////////////////////////////////////////////////////////////////


// GET admin home page.
router.get('/topic', topic_controller.topic_list);


// GET request for creating a topic. NOTE This must come before routes that display topic (uses id).
router.get('/topic/create', topic_controller.topic_create_get);

// POST request for creating topic.
router.post('/topic/create', topic_controller.topic_create_post);

// GET request to delete topic.
router.get('/topic/:id/delete', topic_controller.topic_delete_get);

// POST request to delete topic.
router.post('/topic/:id/delete', topic_controller.topic_delete_post);

// GET request to update topic.
router.get('/topic/:id/update', topic_controller.topic_update_get);

// POST request to update topic.
router.post('/topic/:id/update', topic_controller.topic_update_post);

// GET request for one topic.
router.get('/topic/:id', topic_controller.topic_detail);




/// session ROUTES ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GET request for list of all presenter items.
router.get('/session', session_controller.session_list);

// GET request for creating a presenter. NOTE This must come before routes that display presenter (uses id).
router.get('/session/create', session_controller.session_create_get);

// POST request for creating presenter.
router.post('/session/create', session_controller.session_create_post);

// GET request to delete presenter.
router.get('/session/:id/delete', session_controller.session_delete_get);

// POST request to delete presenter.
router.post('/session/:id/delete', session_controller.session_delete_post);

// GET request to update presenter.
router.get('/session/:id/update', session_controller.session_update_get);

// POST request to update presenter.
router.post('/session/:id/update', session_controller.session_update_post);

// GET request for one presenter.
router.get('/session/:id', session_controller.session_detail);



////////////////////////////// schedule ROUTES ///

// GET request for list of all presenter items.
router.get('/schedule', schedule_controller.schedule_list);

// GET request for creating a presenter. NOTE This must come before routes that display presenter (uses id).
router.get('/schedule/create', schedule_controller.schedule_create_get);

// POST request for creating presenter.
router.post('/schedule/create', schedule_controller.schedule_create_post);

// GET request to delete presenter.
router.get('/schedule/:id/delete', schedule_controller.schedule_delete_get);

// POST request to delete presenter.
router.post('/schedule/:id/delete', schedule_controller.schedule_delete_post);

// GET request to update presenter.
router.get('/schedule/:id/update', schedule_controller.schedule_update_get);

// POST request to update presenter.
router.post('/schedule/:id/update', schedule_controller.schedule_update_post);

// GET request for one presenter.
router.get('/schedule/:id', schedule_controller.schedule_detail);



////////////////////////////// room ROUTES ///

// GET request for list of all presenter items.
router.get('/room', room_controller.room_list);

// GET request for creating a presenter. NOTE This must come before routes that display presenter (uses id).
router.get('/room/create', room_controller.room_create_get);

// POST request for creating presenter.
router.post('/room/create', room_controller.room_create_post);

// GET request to delete presenter.
router.get('/room/:id/delete', room_controller.room_delete_get);

// POST request to delete presenter.
router.post('/room/:id/delete', room_controller.room_delete_post);

// GET request to update presenter.
router.get('/room/:id/update', room_controller.room_update_get);

// POST request to update presenter.
router.post('/room/:id/update', room_controller.room_update_post);

// GET request for one presenter.
router.get('/room/:id', room_controller.room_detail);



module.exports = router;
