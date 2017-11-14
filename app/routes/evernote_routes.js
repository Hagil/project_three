 // evernote -------------------------------
 function evernote_routes(app, passport) {
    
         // send to evernote to do the authentication
         app.get('/connect/evernote', passport.authorize('evernote', {
             scope: 'email'
         }));
    
         // handle the callback after evernote has authorized the user
         app.get('/connect/evernote/callback',
             passport.authorize('evernote', {
                 successRedirect: '/profile',
                 failureRedirect: '/'
             }));
         app.get('/auth/evernote', passport.authenticate('evernote', {
             scope: 'email'
         }));
    
         // handle the callback after evernote has authenticated the user
         app.get('/auth/evernote/callback',
             passport.authenticate('evernote', {
                 successRedirect: '/profile',
                 failureRedirect: '/'
             }));
     }
     module.exports = evernote_routes;