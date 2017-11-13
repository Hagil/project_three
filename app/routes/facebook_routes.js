 // facebook -------------------------------
 function facebook_routes(app, passport) {
    
         // send to facebook to do the authentication
         app.get('/connect/facebook', passport.authorize('facebook', {
             scope: 'email'
         }));
    
         // handle the callback after facebook has authorized the user
         app.get('/connect/facebook/callback',
             passport.authorize('facebook', {
                 successRedirect: '/profile',
                 failureRedirect: '/'
             }));
         app.get('/auth/facebook', passport.authenticate('facebook', {
             scope: 'email'
         }));
    
         // handle the callback after facebook has authenticated the user
         app.get('/auth/facebook/callback',
             passport.authenticate('facebook', {
                 successRedirect: '/profile',
                 failureRedirect: '/'
             }));
     }
     module.exports = facebook_routes;