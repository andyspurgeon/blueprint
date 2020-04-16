'use strict';

/**
 * @file        userRouter.js
 * @summary     Handles user-related requests.
 */


    // **************************************************
    // Modules
    // **************************************************
const authCheck = require('../middleware/passportAuthCheck');
const router = require('express').Router();
const User = require('../models/user');


/**
 * @summary     Renders the dashboard view.
 *
 * req
 * res
 */
router.get('/user/dashboard', authCheck.isAuthenticated, function (req, res, next) {
    res.render('user/dashboard');
});


/**
 * @summary     Renders the user profile view.
 *
 * req
 * res
 */
router.get('/user/profile', authCheck.isAuthenticated, function (req, res, next) {
    res.render('user/profile');
});


/**
 * @summary     Renders the admin view.
 *
 * req
 * res
 */
router.get('/user/admin', authCheck.isAuthenticated, function (req, res, next) {
    res.render('user/admin');
});


// Export the router
module.exports = router;