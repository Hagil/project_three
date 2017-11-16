var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

//to do list 
var http = require('http');
var path = require('path');
var methodOverride = require('method-override');

app.use(function(req, res, next) {
    req.db = {};
    req.db.tasks = db.collection('tasks');
    next();
})
app.set('views', __dirname + '/list_views');

app.use(function(req, res, next) {
  res.locals._csrf = req.session._csrf;
  return next();
})

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.param('task_id', function(req, res, next, taskId) {
  req.db.tasks.findById(taskId, function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Task is not found.'));
    req.task = task;
    return next();
  });
});

app.get('/', list_routes.index);
app.get('/tasks', tasks.list);
app.post('/tasks', tasks.markAllCompleted)
app.post('/tasks', tasks.add);
app.post('/tasks/:task_id', tasks.markCompleted);
app.del('/tasks/:task_id', tasks.del);
app.get('/tasks/completed', tasks.completed);

app.all('*', function(req, res){
  res.send(404);
});

// // configuration ===============================================================
mongoose.connect(configDB.url, {
    useMongoClient: true
}); // connect to our database
mongoose.Promise = require('bluebird');

require('./config/passport/main_passport')(passport); // pass passport for configuration

// set up our express application
app.use(express.static('public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'ballislife'
})); // session secret
 app.use(passport.initialize());
 app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes/main_routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//to do list
//require('./list/list.js')(); 

app.listen(port, function(){
    console.log('listening on port ' + port);

});