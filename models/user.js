'use strict';

/**
 * @file:           user.js
 * @summary:        User data model.
 */

// **************************************************
// Node and npm Modules
// **************************************************
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

// **************************************************
// User Schema Definition
// **************************************************
let User = new Schema( {
    firstName: {
        type:           String,
        required:       false
    },
    lastName: {
        type:           String,
        required:       false
    },
    username: {
        type:           String,
        index:          true,
        unique:         true,
        lowercase:      true,
        required:       true
    },
    roles: {
        type:           [String],
        required:       true,
        default:        'user'
    },
    failedLoginAttempts: {
        type:           Number,
        required:       true,
        default:        0
    },
    resetPasswordToken: {
        type:           String,
        required:       false
    },
    resetPasswordExpires: {
        type:           Date,
        required:       false
    },
    dateCreated: {
        type:           Date,
        required:       true,
        default:        Date.now
    }
});

// **************************************************
// passport-local-mongoose Plugin
// **************************************************
const pluginOptions = ({
    usernameLowerCase:      true,
    limitAttempts:          true,
    maxAttempts:            3,
    attemptsField:          'failedLoginAttempts'
});
User.plugin(passportLocalMongoose, pluginOptions);

// **************************************************
// Export the model
// **************************************************
module.exports = mongoose.model('User', User);