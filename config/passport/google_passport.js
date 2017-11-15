function google_passport(User, passport) {
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    // load up the user model
    var User = require('../../app/models/user');

    var configAuth = require('../auth');

    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
        },
        function (req, token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function () {

                if (!req.user) {

                    // try to find the user based on their google id
                    User.findOne({
                        'google.id': profile.id
                    }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            if (!user.google.token) {
                                user.google.token = token;
                                user.google.name = profile.name.givenName + ' ' + profile.name.familyName;
                                user.google.email = profile.emails[0].value;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }
                            // if a user is found, log them in
                            return done(null, user);
                        } else {
                            // if the user isnt in our database, create a new user
                            var newUser = new User();

                            // set all of the relevant information
                            newUser.google.id = profile.id;
                            newUser.google.token = token;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value; // pull the first email

                            // save the user
                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.google.id = profile.id;
                    user.google.token = token;
                    user.google.name = profile.displayName;
                    user.google.email = profile.emails[0].value; // pull the first email

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
            });
        }));
};
module.exports = google_passport;