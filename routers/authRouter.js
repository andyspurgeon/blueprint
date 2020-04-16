'use strict';

/**
 * @file        authRouter.js
 * @summary     Handles authentication-related requests.
 */


// **************************************************
// Modules
// **************************************************
const authCheck = require('../middleware/passportAuthCheck');
const logger = require('../modules/logger').Logger;
const passport = require('passport');
const router = require('express').Router();
const auth = require('../models/user');

const check = require('express-validator').check;
const validationResult = require('express-validator').validationResult;



/**
 * @summary     Renders the signIn view.
 *
 * req
 * res
 */
router.get('/auth/signIn', function (req, res, next) {
    res.render('auth/signIn');
});


/**
 * @summary     Handles user sign in / authentication requests.
 *
 * req
 * res
 */
router.post('/auth/signIn', function (req, res, next) {
    passport.authenticate('local', {successRedirect: '/user/dashboard', failureRedirect: '/auth/signIn', failureFlash: true})(req, res, next);
});


/**
 * @summary     Renders the signUp view.
 *
 * req
 * res
 */
router.get('/auth/signUp', function (req, res, next) {
    res.render('auth/signUp');
});


/**
 * @summary     Handles user sign up / account creation requests.
 *
 * req
 * res
 */
router.post('/auth/signUp', function (req, res, next) {
    // Validate input
    check(req.body.username, 'Email address is a required field.').notEmpty();
    check(req.body.username, 'You did not provide a valid email address.').isEmail();
    check(req.body.password, 'Password is a required field.').notEmpty();
    check(req.body.password, 'Passwords must be between 8 and 30 characters in length.').isLength(8, 30);
    check(req.body.confirmPassword, 'Confirm Password is a required field.').notEmpty();
    check(req.body.confirmPassword, 'Passwords do not match.').equals(req.body.password);

    // Collect validation errors
    const validationErrors = validationResult(req);

    /*
    if(validationErrors)
    {
        logger.warn(validationErrors, `Validation errors on signup request for new auth: ${req.body.authname}.`);
        req.flash('validation', validationErrors);
        res.render('auth/signUp', { formData: req.body } );
        return;
    }
    */
    if(!validationErrors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    else
    {
        auth.register(new auth({
            username: req.body.username
        }), req.body.password, function (error, auth)
        {
            if (error)
            {
                logger.error(error, `Error on signup request for authname: ${req.body.authname}.`);
                req.flash('error', error.message);
                res.render('auth/signUp', { formData: req.body } );
                return;
            }

            passport.authenticate('local', {
                successRedirect: '/user/dashboard',
                failureRedirect: '/auth/signIn',
                failureFlash: true
            })(req, res, next);
        });
    }

});


/**
 * @summary     Render lost password view.
 *
 * req
 * res
 */
router.get('/auth/lostPasswordHelp', function (req, res, next) {
    res.render('auth/lostPasswordHelp');
});


/**
 * @summary     Process lost password request.
 *
 * req
 * res
 */
router.post('/auth/lostPasswordHelp', function (req, res, next) {
    // TODO: Implement lost password process
});


/**
 * @summary     Render reset password view.
 *
 * req
 * res
 */
router.get('/auth/passwordChangeHelp', function (req, res, next) {
    res.render('auth/passwordChangeHelp');
});


/**
 * @summary     Process reset password request.
 *
 * req
 * res
 */
router.post('/auth/passwordChangeHelp', function (req, res, next) {
    // TODO: Implement password reset
});


/**
 * @summary     Handles sign out requests.
 *
 * req
 * res
 */
router.get('/auth/signOut', function (req, res, next) {
    req.logout();
    res.redirect('/');
});


// Export the router
module.exports = router;