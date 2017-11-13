function facebook_passport(User, passport) {
    var FacebookStrategy = require('passport-facebook').Strategy;
    // load up the user model
    var User = require('../../app/models/user');

    var configAuth = require('../auth');

    passport.use(new FacebookStrategy({
            // pull in our app id and secret from our auth.js file
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: configAuth.facebookAuth.profileFields,
            passReqToCallback: true
        },
        // facebook will send back the token and profile
        function (req, token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function () {
                if (!req.user) {
                    // find the user in the database based on their facebook id
                    User.findOne({
                        'facebook.id': profile.id
                    }, function (err, user) {
                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found, then log them in
                        if (user) {
                            if (!user.facebook.token) {
                                user.facebook.token = token;
                                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.facebook.email = profile.emails[0].value;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that facebook id, create them
                            var newUser = new User();

                            // set all of the facebook information in our user model
                            newUser.facebook.id = profile.id; // set the users facebook id                   
                            newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

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

                    // update the current users facebook credentials
                    user.facebook.id = profile.id;
                    user.facebook.token = token;
                    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    user.facebook.email = profile.emails[0].value;

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
module.exports = facebook_passport;