'use strict';

/**
 * @file:       passportAuthCheck.js
 * @brief:      Uses passport authentication to verify a user is authenticated before providing access
 *              to a secure endpoint.
 */

/**
 * @summary     isAuth: A wee bit-o-middleware to verify the user is authenticated before providing access
 *              to a secure endpoint. Redirects user to the '/auth/signin' view if not authenticated.
 *
 * @param req
 * @param res
 * @param next
 */
exports.isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/auth/signIn');
};