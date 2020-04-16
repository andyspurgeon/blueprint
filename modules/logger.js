'use strict';

/**
 * @file            logger.js
 * @summary         Wraps node-bunyan to offer an app-wide logging capability.
 */

// **************************************************
// Required Modules
// **************************************************
const bunyan = require('bunyan');
const bunyanDebugStream = require('bunyan-debug-stream');

// **************************************************
// Logging
// **************************************************
// TODO: Consider Loggly integration via bunyan-loggly?
const Logger = bunyan.createLogger({
    name:                   'epicenter',
    streams: [{
        level:              process.env.LOG_LEVEL,
        type:               'raw',
        stream: bunyanDebugStream({
            basepath:       __dirname, // this should be the root folder of your project.
            forceColor:     true
        })
    },
        {
            level:          process.env.LOG_LEVEL,
            type:           'file',
            path:           process.env.LOG_FILE
        }],
    serializers: bunyanDebugStream.serializers
});

// **************************************************
// Export the Logger
// **************************************************
module.exports.Logger = Logger;