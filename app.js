'use strict';

/**
 * @file            app.js
 * @summary         Entry point for the server application.
 */

// **************************************************
// Environment Config
// **************************************************
require('dotenv').config();

// **************************************************
// Node and npm Modules
// **************************************************
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
require('pug');
const session = require('express-session');

// **************************************************
// Local Modules / Models
// **************************************************
// const Logger = require('./modules/logger').Logger;
const User = require('./models/user');

// **************************************************
// SSL Configuration
// **************************************************
const sslOptions = {
    key:    fs.readFileSync(process.env.SSL_KEY),
    cert:   fs.readFileSync(process.env.SSL_CERT)
};

// **************************************************
// Database Configuration / Connection
// **************************************************
mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        //Logger.info('Database connection successful.');
        console.log('Database connection successful.');
    },
    (error) => {
        //Logger.fatal(error, `Database connection error.  Cannot connect to: ${process.env.DB_CONN}.  Make sure MongoDB is running and reachable.`);
        console.log(error, `Database connection error.  Cannot connect to: ${process.env.DB_CONN}.  Make sure MongoDB is running and reachable.`);
    }
);
const database = mongoose.connection;
mongoose.set('useCreateIndex', true);

// **************************************************
// Session Management
// **************************************************
const MongoStore = require('connect-mongo')(session);

// **************************************************
// Express App and Configuration
// **************************************************
const app = express();
app.set('views', path.join(__dirname, 'views'))
    .set('view engine', 'pug')
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    //.use(expressValidator())
    .use(cookieParser())
    .use(session({
        resave:             true,
        saveUninitialized:  true,
        secret:             process.env.SESSION_KEY,
        store:              new MongoStore({
            url:            process.env.DB_CONN
        })
    }))
    .use(flash())
    .use(morgan('dev'))
    .use(passport.initialize())
    .use(passport.session())
    .use(express.static(path.join(__dirname, 'public')));

// ****************************************
// Passport authentication configuration
// ****************************************
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// **************************************************
// Session Middleware
// (gives Views/Layouts direct access to session data)
// TODO: Move to its own middleware module
// **************************************************
app.use(function (req, res, next) {
    let origRender = res.render;
    res.render = function (view, locals, callback) {
        if ('function' === typeof locals) {
            callback = locals;
            locals = undefined;
        }

        if (!locals) {
            locals = {};
        }

        locals.req = req;
        origRender.call(res, view, locals, callback);
    };
    next();
});

// **************************************************
// Load Routers
// **************************************************
const authRouter = require('./routers/authRouter');
const homeRouter = require('./routers/homeRouter');
// const mapRouter = require('./routers/mapRouter');
// const userRouter = require('./routers/userRouter');

// **************************************************
// Configure Routes
// **************************************************
app.use('/', authRouter);
app.use('/', homeRouter);
// app.use('/', mapRouter);
// app.use('/', userRouter);

// **************************************************
// Error Middleware
// TODO: This is not production/security safe...
// TODO: Move to its own middleware module
// **************************************************
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Main error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/error', {
        message: err.message,
        error: err
    });
});

// **************************************************
// HTTPS Server
// **************************************************
// TODO: Move the app behind nginx?
const httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(process.env.HTTPS_PORT);
//Logger.info(`Welcome to Epicenter! HTTPS server listening on port ${process.env.HTTPS_PORT}.`);
console.log(`Welcome to Epicenter! HTTPS server listening on port ${process.env.HTTPS_PORT}.`);

// **************************************************
// Export the Express App
// **************************************************
module.exports = app;