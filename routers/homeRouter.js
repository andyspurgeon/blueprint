'use strict';

/**
 * @file        homeRouter.js
 * @summary     Handles requests on various unauthenticated home routes.
 */

const router = require('express').Router();


/**
 * @summary     Renders the home view.
 *
 * req
 * res
 */
router.get('/', function (req, res, next) {
    res.render('home/home');
});


// Export the router
module.exports = router;