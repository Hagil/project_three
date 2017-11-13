// load up the user model
var User = require('../../app/models/user');

var configAuth = require('../auth');

// expose this function to our app using module.exports
module.exports = function (passport) {
    var local_passport = require('./local_passport')
    local_passport(User, passport);

    var facebook_passport = require('./facebook_passport')
    facebook_passport(User, passport, configAuth);


    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};