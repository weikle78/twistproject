var Presenter = require('../models/presenter');
var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Display list of all Presenters.
exports.presenter_list = function(req, res, next) {

    Presenter.find({})
      .sort([['lastName', 'ascending']])
      .exec(function (err, list_presenters) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('presenter_list', { title: 'Presenter List', presenter_list: list_presenters });
      });
      
  };

  // Display detail page.
exports.presenter_detail = function(req, res, next) {
    Presenter.findById(req.params.id)
    .exec(function(err, results){
        if (err) {return next(err);}
            if (results==null){
                var err = new Error('Presenter not found');
                err.status = 404;
                return next(err)
            }
        res.render('presenter_detail', {
            title: 'Presenter Details',
            presenter: results,
        })
    })  
};
  
// Display  create form on GET.
exports.presenter_create_get = function(req, res) {
    res.render('presenter_create', {
        title: 'New Presenter'
    });
};
  
// Handle Presenter create on POST
exports.presenter_create_post = [

    // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('occupation', 'Occupation Required').isLength({ min:1 }).trim(),
    body('mainPhone', 'Main Phone is required').isLength({ min:1 }).trim(),
    body('mobilePhone', 'Mobile Phone is required').isLength({ min:1 }).trim(),
    body('email', 'Email is required').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),
    sanitizeBody('occupation').trim().escape(),
    sanitizeBody('mainPhone').trim().escape(),
    sanitizeBody('mobilePhone').trim().escape(),
    sanitizeBody('email').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('presenter', { title: 'Create Presenter', presenter: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create a Presenter object with escaped and trimmed data.
            var presenter = new Presenter(
                {
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    occupation: req.body.occupation,
                    mainPhone: req.body.mainPhone,
                    mobilePhone: req.body.mobilePhone,
                    email: req.body.email
                });
            presenter.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new presenter record.
                res.redirect(presenter.url);
            });
        }
    }
];
  
exports.presenter_delete_get = function(req, res, next) {
	
    Presenter.findById(req.params.id).exec(function(err, results) {
        if (err) { return next(err); }
        if (results==null) { res.redirect('/admin/presenter'); }
        res.render('presenter_delete', { title: 'Delete presenter', presenter: results})
    });
};
// Handle delete on POST.
exports.presenter_delete_post = function(req, res) {
    Presenter.findByIdAndDelete(req.params.id, function deletePresenter(err){
        if (err) return next(err)
        res.redirect('/admin/presenters');
    });
};

// Display update form on GET.
exports.presenter_update_get = function(req, res, next) {
    Presenter.findById(req.params.id, function (err, presenter){
        if(err){return next(err);}
        if(presenter == null) {
            res.redirect('/admin/presenters/')
        }
        res.render('presenter_update', { title: 'Update Participation', presenter: presenter});
    });
};

// Handle update on POST.
exports.presenter_update_post = [

    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('mainPhone').isLength({ min: 1 }).trim().withMessage('no phone number entered'),
    body('email').isLength({ min: 1 }).trim().withMessage('no email entered'),

    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),
    sanitizeBody('mainPhone').trim().escape(),
    sanitizeBody('email').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('presenter_update', { title: 'Update presenter', _id: presenter._id, presenter: presenter, errors: errors.array()});
            return;
        }
        else {
            var presenter = new Presenter({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                email: req.body.email,
                _id:req.params.id
            });
            Presenter.findByIdAndUpdate(req.params.id, presenter, {}, function (err, thepresenter) {
                if (err) {return next(err);}
                res.redirect(thepresenter.url);
            });
        }
    }
];