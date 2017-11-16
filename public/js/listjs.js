console.log('loaded front-end js');

$(document).ready(do_setup);

function do_setup() {
    $.get('/api/read_tasks').done(do_tasks).fail(blow_up);
}

function do_tasks(data) {
    console.log(data);
}

function blow_up(message) {
    console.log(message);
}