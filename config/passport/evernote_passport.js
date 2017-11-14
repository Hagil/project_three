function evernote_passport(User, passport) {
    var evernoteStrategy = require('passport-evernote').Strategy;
    // load up the user model
    var User = require('../../app/models/user');

    var configAuth = require('../auth');

    passport.use(new evernoteStrategy({
            // pull in our app id and secret from our auth.js file
            consumerKey: configAuth.evernoteAuth.consumerKey,
            consumerSecret: configAuth.evernoteAuth.consumerSecret,
            callbackURL: configAuth.evernoteAuth.callbackURL,
            profileFields: configAuth.evernoteAuth.profileFields,
            passReqToCallback: true
        },
        // evernote will send back the token and profile
        function (req, token, tokenSecret, profile, done) {
            // asynchronous
            process.nextTick(function () {
                if (!req.user) {
                    // find the user in the database based on their evernote id
                    User.findOne({
                        'evernote.id': profile.id
                    }, function (err, user) {
                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found, then log them in
                        if (user) {
                            if (!user.evernote.token) {
                                user.evernote.token = token;
                                user.evernote.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.evernote.email = profile.emails[0].value;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that evernote id, create them
                            var newUser = new User();

                            // set all of the evernote information in our user model
                            newUser.evernote.id = profile.id; // set the users evernote id                   
                            newUser.evernote.token = token; // we will save the token that evernote provides to the user                    
                            newUser.evernote.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                            newUser.evernote.email = profile.emails[0].value; // evernote can return multiple emails so we'll take the first

                            // save our user to the database
                            newUser.save(function (err) {
                                if (err)
                                    throw err;

                                // if successful, return the new user
                                return done(null, newUser);
                            });
                        }

                    });
                } else {
                    var user = req.user; // pull the user out of the session

                    // update the current users evernote credentials
                    user.evernote.id = profile.id;
                    user.evernote.token = token;
                    user.evernote.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.evernote.email = profile.emails[0].value;

                    // save the user
                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
            });
        }));
};
module.exports = evernote_passport;