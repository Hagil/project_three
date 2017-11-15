function instagram_routes(app, passport) {
    
        // send to instagram to do the authentication
        app.get('/connect/instagram', passport.authorize('instagram', {}));
    
        // handle the callback after instagram has authorized the user
        app.get('/connect/instagram/callback',
            passport.authorize('instagram', {
                successRedirect: '/profile',
                failureRedirect: '/'
            }));
        app.get('/auth/instagram', passport.authenticate('instagram', {}));
    
    
        app.get('/auth/instagram/callback',
            passport.authenticate('instagram', {
                successRedirect: '/profile',
                failureRedirect: '/'
            }));
    
    }
    module.exports = instagram_routes;