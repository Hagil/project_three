function dropbox_passport(User, passport) {
    var dropboxStrategy = require('passport-dropbox').Strategy;
    // load up the user model
    var User = require('../../app/models/user');

    var configAuth = require('../auth');

    passport.use(new dropboxStrategy({
            // pull in our app id and secret from our auth.js file
            appKey: configAuth.dropboxAuth.appKey,
            appSecret: configAuth.dropboxAuth.appSecret,
            callbackURL: configAuth.dropboxAuth.callbackURL,
            profileFields: configAuth.dropboxAuth.profileFields,
            passReqToCallback: true
        },
        // dropbox will send back the token and profile
        function (req, token, tokenSecret, profile, cb) {
            // asynchronous
            process.nextTick(function () {
                if (!req.user) {
                    // find the user in the database based on their dropbox id
                    User.findOne({
                        'dropbox.id': profile.id
                    }, function (err, user) {
                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return cb(err);

                        // if the user is found, then log them in
                        if (user) {
                            if (!user.dropbox.token) {
                                user.dropbox.token = token;
                                user.dropbox.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.dropbox.email = profile.emails[0].value;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return cb(null, user);
                                });
                            }
                            return cb(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that dropbox id, create them
                            var newUser = new User();

                            // set all of the dropbox information in our user model
                            newUser.dropbox.id = profile.id; // set the users dropbox id                   
                            newUser.dropbox.token = token; // we will save the token that dropbox provides to the user                    
                            newUser.dropbox.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                            newUser.dropbox.email = profile.emails[0].value; // dropbox can return multiple emails so we'll take the first

                            // save our user to the database
                            newUser.save(function (err) {
                                if (err)
                                    throw err;

                                // if successful, return the new user
                                return cb(null, newUser);
                            });
                        }

                    });
                } else {
                    var user = req.user; // pull the user out of the session

                    // update the current users dropbox credentials
                    user.dropbox.id = profile.id;
                    user.dropbox.token = token;
                    user.dropbox.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.dropbox.email = profile.emails[0].value;

                    // save the user
                    user.save(function (err) {
                        if (err)
                            throw err;
                        return cb(null, user);
                    });
                }
            });
        }));
};
module.exports = dropbox_passport;