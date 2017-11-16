var mongoose = require('mongoose');
mongoose.Promise = global.Promise; // fixes mongoose weird no-promise-support error

var url = 'mongodb://localhost:27500/project_three';

mongoose.connect(url, {useMongoClient: true});

// TODO - sort date out in schema to be an actual date!
var schema = new mongoose.Schema({
    task: String,
    date: String
})

// this class will create a collections called 'tasks' using the above schema design
var TASKCLASS = mongoose.model('tasks', schema);

module.exports = TASKCLASS;

