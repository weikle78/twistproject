var Topic = require('../models/Topic');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list.
exports.topic_list = function(req, res) {
    Topic.find()
    .sort([['topicCode', 'ascending']])
    .exec(function (err, list_topics) {
        if (err) { return next(err);}
        res.render('topic_list', { title: 'Topics', topic_list: list_topics});
    });
};

// Display detail page.
exports.topic_detail = function(req, res, next) {
	
	Topic.findById(req.params.id).exec(function (err, topic)
	{
		if (err) { return next(err); }
		if (topic==null) {
			var err = new Error('Topic not found');
			err.status = 404;
			return next(err);
        }
		res.render('topic_detail', { title: 'Topic Details', topic: topic})
	});
};

// Display  create form on GET.
exports.topic_create_get = function(req, res) {
    res.render('topic_create', { title: 'New Topic'});
};

// Handle  create on POST.
exports.topic_create_post = [
    body('topicCode').isLength({ min: 1}).trim(),
	body('title').isLength({ min: 1 }).trim().withMessage('A Title is required.'),
	body('description').isLength({min:1}).trim().withMessage('Please describe the topic'),

    sanitizeBody('topicCode').trim(),
	sanitizeBody('title').trim(),
    sanitizeBody('description').trim(),
 	function(req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('topic_create', { title: 'New Topic', topic: req.body, errors: errors.array() });
            return;
        }
        else {
            var topic = new Topic(
                {
                    topicCode: req.body.topicCode,
                    title: req.body.title,
                    description: req.body.description,
                });
            topic.save(function (err) {
                if (err) { return next(err); }
                res.redirect(topic.url);
            });
        }
	}
];

exports.topic_delete_get = function(req, res, next) {
    Topic.findById(req.params.id).exec(function (err, topic)
	{
		if (err) { return next(err); }
		if (topic==null) {
			res.redirect('/admin/Topic/');
        }
		res.render('topic_delete', { title: 'Delete Topic', topic: topic})
	});
};

// Handle delete on POST.
exports.topic_delete_post = function(req, res) {
			
	Topic.findByIdAndRemove(req.params.id, function deleteTopic(err) {
		if (err) {return next(err); }
		res.redirect('/admin/Topic')
	});
};

// Display update form on GET.
exports.topic_update_get = function(req, res) {
	
    Topic.findById(req.params.id).exec(function (err, topic)
	{
		if (err) { return next(err); }
		if (topic==null) {
			res.redirect('/admin/Topic/');
        }

		res.render('topic_update', { 
            title: 'Update Topic',
            topic: topic, 
            _id: topic._id,
            topicCode: topic.topicCode,
            title: topic.title, 
            description: topic.description,
        });
	});
};

// Handle update on POST.
exports.topic_update_post = [
	body('topicCode').isLength({ min: 1}).trim(),
	body('title').isLength({ min: 1 }).trim().withMessage('A Title is required.'),
	body('description').isLength({min:1}).trim().withMessage('Please describe the topic'),

    sanitizeBody('topicCode').trim(),
	sanitizeBody('title').trim(),
    sanitizeBody('description').trim(),


 	function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
			res.render('topic_update', { 
                title: 'Update Topic', 
                topic: topic,
                topicCode: req.body.topicCode,
                title: req.body.title,
                description: req.body.description,
                _id:req.params.id,
                errors: errors.array()
            });
            return;
        }
        else {
            var topic = new Topic(
                {
                    topicCode: req.body.topicCode,
                    title: req.body.title,
                    description: req.body.description,
                    _id:req.params.id
                });
            Topic.findByIdAndUpdate(req.params.id, topic, {}, function (err, thetopic) {
                if (err) { return next(err); }
                res.redirect(thetopic.url);
            });
        }
	}
];