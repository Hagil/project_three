function local_routes(app, passport) {
    
        // LOGIN ===============================
        // show the login form
        app.get('/login', function (req, res) {
    
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', {
                message: req.flash('loginMessage')
            });
        });
    
        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }));
    
        // SIGNUP ==============================
        // show the signup form
        app.get('/signup', function (req, res) {
    
            // render the page and pass in any flash data if it exists
            res.render('signup.ejs', {
                message: req.flash('signupMessage')
            });
        });
    
        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/profile',
            failureRedirect: '/signup',
            failureFlash: true
        }));
    
    }
    module.exports = local_routes;