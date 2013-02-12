/**
 * Main app routing methods
 */

var db = require('../modules/database.js');

/*
 * GET home page
 */
exports.index = function(req, res){
	var title = req.cookies.tlogin ? 'Welcome, ' + req.cookies.tlogin : 'Trakkker';
	
	res.render('index', { title: title });
}

/*
 * GET .ejs view partials (partials/:name)
 */
exports.partials = function (req, res) {
	res.render('partials/' + req.params.name);
}

/*
 * POST login form to authorize
 */
exports.signIn = function (req, res) {
	db.findUser(req.body, function (err, doc) {
		if (doc) {
			res.cookie('tlogin', req.body.login, { maxAge: 900000 });
			res.send(230);
		} else {
			res.send(err, 531);
		}
	})
}

/*
 * POST logout
 */
exports.signOut = function (req, res) {
	console.log(req.param('cookie'));
	res.clearCookie(req.param('cookie'));
	res.send(200);
}

/*
 * GET all tasks (/api/all/:login)
 */
exports.allTasks = function (req, res) {
	db.getAllUserTasks(req.param('login'), function (err, docs) {
		if (docs) {
			res.json(docs);
		} else {
			res.send(err, 400);
		}
	});
}

/*
 * GET only active tasks (/api/active/:login)
 */
exports.activeTasks = function (req, res) {
	db.getActiveUserTasks(req.param('login'), function (err, docs) {
		if (docs) {
			res.json(docs);
		} else {
			res.send(err, 400);
		}
	})
}

/*
 * GET one task details
 */
exports.oneTask = function (req, res) {
	db.getTaskById(req.param('login'), req.param('id'), function (err, docs) {
		if (docs) {
			res.json(docs);
		} else {
			res.send(err, 400);
		}
	});
}

/*
 * POST create new task (/api/new)
 */
exports.addTask = function (req, res) {
	db.addUserTasks(req.body, function (err, doc) {
		if (doc) {
			res.send(200);
		} else {
			res.send(err, 400);
		}
	});
}

/*
 * PUT update existing task (/api/update) 
 */
exports.updateTask = function (req, res) {
	db.updateUserTasks(req.body, function (err, doc) {
		if (doc) {
			res.send(200);
		} else {
			res.send(err, 400);
		}
	});
}

/*
 * DELETE delete task from db (/delete/:login/:task id)
 */
exports.deleteTask = function (req, res) {
	db.deleteTaskById(req.param('login'), req.param('id'), function (err, doc) {
		if (doc) {
			res.send(200);
		} else {
			res.send(err, 400);
		}
	})
}