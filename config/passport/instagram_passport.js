function instagram_passport(User, passport) {
    var InstagramStrategy = require('passport-instagram').Strategy;;
    // load up the user model
    var User = require('../../app/models/user');

    var configAuth = require('../auth');

    passport.use(new InstagramStrategy({
            // pull in our app id and secret from our auth.js file
            clientID: configAuth.instagramAuth.clientID,
            clientSecret: configAuth.instagramAuth.clientSecret,
            callbackURL: configAuth.instagramAuth.callbackURL,
            passReqToCallback: true
        },
        // instagram will send back the token and profile
        function (req, token, refreshToken, profile, done) {
            // asynchronous
            process.nextTick(function () {
                if (!req.user) {
                    // find the user in the database based on their instagram id
                    User.findOne({
                        'instagram.id': profile.id
                    }, function (err, user) {
                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found, then log them in
                        if (user) {
                            if (!user.instagram.token) {
                                user.instagram.token = token;
                                user.instagram.username = profile.username;
                                user.instagram.displayName = profile.displayName;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that instagram id, create them
                            var newUser = new User();

                            // set all of the instagram information in our user model
                            newUser.instagram.id = profile.id; // set the users instagram id                   
                            newUser.instagram.token = token; // we will save the token that instagram provides to the user                    
                            newUser.instagram.username = profile.username; // look at the passport user profile to see how names are returned
                            newUser.instagram.displayName = profile.displayName; // instagram can return multiple emails so we'll take the first

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

                    // update the current users instagram credentials
                    user.instagram.id = profile.id;
                    user.instagram.token = token;
                    user.instagram.username = profile.username;
                    user.instagram.displayName = profile.displayName;

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
module.exports = instagram_passport;