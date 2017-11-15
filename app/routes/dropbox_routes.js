 // dropbox -------------------------------
 function dropbox_routes(app, passport) {
    
         // send to dropbox to do the authentication
         app.get('/connect/dropbox', passport.authorize('dropbox', {
             scope: 'email'
         }));
    
         // handle the callback after dropbox has authorized the user
         app.get('/connect/dropbox/callback',
             passport.authorize('dropbox', {
                 successRedirect: '/profile',
                 failureRedirect: '/'
             }));
         app.get('/auth/dropbox', passport.authenticate('dropbox', {
             scope: 'email'
         }));
    
         // handle the callback after dropbox has authenticated the user
         app.get('/auth/dropbox/callback',
             passport.authenticate('dropbox', {
                 successRedirect: '/profile',
                 failureRedirect: '/'
             }));
     }
     module.exports = dropbox_routes;