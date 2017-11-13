module.exports = function (app, passport) {
    
        // HOME PAGE (with login links) ========
        // =====================================
        app.get('/', function (req, res) {
            res.render('index.ejs'); // load the index.ejs file
        });
    
        var local_routes = require('./local_routes')
        local_routes(app, passport);
    
        var facebook_routes = require('./facebook_routes');
        facebook_routes(app, passport);
    
        // route for logging out
        app.get('/logout', function (req, res) {
            req.logout();
            res.redirect('/');
        });
    
        // PROFILE SECTION =====================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function (req, res) {
            res.render('profile.ejs', {
                user: req.user // get the user out of session and pass to template
            });
        });
    
    
        //locally
        app.get('/connect/local', function (req, res) {
            res.render('connect-local.ejs', {
                message: req.flash('loginMessage')
            });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }));
    
        // =============================================================================
        // UNLINK ACCOUNTS =============================================================
        // =============================================================================
        // used to unlink accounts. for social accounts, just remove the token
        // for local account, remove email and password
        // user account will stay active in case they want to reconnect in the future
    
        // local -----------------------------------
        app.get('/unlink/local', function (req, res) {
            var user = req.user;
            user.local.email = undefined;
            user.local.password = undefined;
            user.save(function (err) {
                res.redirect('/profile');
            });
        });
    
        // facebook -------------------------------
        app.get('/unlink/facebook', function (req, res) {
            var user = req.user;
            user.facebook.token = undefined;
            user.save(function (err) {
                res.redirect('/profile');
            });
        });
    };
    
    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
    
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
    
        // if they aren't redirect them to the home page
        res.redirect('/');
    }