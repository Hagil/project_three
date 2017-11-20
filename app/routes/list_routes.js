function list_routes(app) {

    // var router = require('express').Router();
    var TASKCLASS = require('../../mongodb/mongo_connect');
    // module.exports = router;

    // router.get('/', do_homepage);

    function do_homepage(req, res) {
        console.log('rendering homepage');
        res.render('listdb');
    }

    // api routes
    app.get('/listdb', listdb);
    app.get('/api/read_tasks', read_tasks);
    app.post('/api/create_task', create_task);
    app.put('/api/update_task', update_task);
    app.delete('/api/delete_task/:_id', delete_task);

    function listdb(req, res) {
        console.log('rendering listdb');
        res.render('listdb');
    };

    function read_tasks(req, res) {
        console.log('reading tasks');
        TASKCLASS.find()
            .then(function (results) {
                console.log(results);
                res.json(results);
            })
    }

    function create_task(req, res) {
        console.log('creating task');
        // is the jquery sending a task object?
        console.log(req.body);
        var task = req.body;
        var newTask = new TASKCLASS(req.body);
        newTask.save()
            .then(function (results) {
                console.log(results);
                res.json({
                    result: 'saved!'
                });
            })
    }


    function update_task(req, res) {
        console.log('updating task');
        // is the jquery sending a task object?
        console.log(req.body);
        var update = {
            $set: {
                task: req.body.task,
                date: req.body.date
            }
        }
        TASKCLASS.findByIdAndUpdate(req.body._id, update)
            .then(function (results) {
                console.log(results);
                res.json({
                    result: 'updated!'
                })
            })
    }

    function delete_task(req, res) {
        console.log('deleting task');
        console.log(req.params);
        TASKCLASS.findByIdAndRemove(req.params._id, function (err, data) {
            if (err) return err;
            res.json({
                result: 'deleted!'
            });
        })
    }
}
module.exports = list_routes;