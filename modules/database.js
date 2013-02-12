/**
 * Main database methods
 * Using 'cradle' module as CouchDB client (https://github.com/cloudhead/cradle)
 */

var cradle = require('cradle'),
	moment = require('moment'),
	helpers = require('../modules/helpers'),
	settings = require('../settings');

var c = new cradle.Connection(settings.couchdb.url, settings.couchdb.port, {
	auth: { 
		username: settings.couchdb.username, 
		password: settings.couchdb.password 
	}
});

var db = c.database(settings.couchdb.name);

/*
 * Get full list of tasks
 */
exports.getAllUserTasks = function (login, callback) {
	db.view('tracker/users', { key: login }, function (err, doc) {
		if (err) {
			callback(err);
		}

		if (doc.length > 0) {
			var tasks = doc[0].value.tasks;

			tasks.forEach(function (row, i) {
				row.ellapsed_time = helpers.replaceDots(row.ellapsed_time);
			});
			tasks.reverse();
			callback(err, tasks);
		} else {
			callback('User not found');
		}
	})
}

/*
 * Get tasks that were not stopped (ellapsed_time: false)
 */
exports.getActiveUserTasks = function (login, callback) {
	db.view('tracker/users', { key: login }, function (err, doc) {
		if (err) {
			callback(err);
		}

		if (doc.length > 0) {
			var activeTasks = [];

			doc[0].value.tasks.forEach(function (row, i) {
				if (!row.ellapsed_time) {
					row.ellapsed_time = helpers.dateDifference(row.date);
					activeTasks.push(row);
				}
			});
			callback(err, activeTasks);
		} else {
			callback('User not found');
		}
	})
}

/*
 * Get special task details array (with uncompleted ones too)
 */
exports.getTaskById = function (login, id, callback) {
	db.view('tracker/users', { key: login }, function (err, doc) {
		if (err) {
			callback(err);
		}

		if (doc.length > 0) {
			var showTask = [];

			doc[0].value.tasks.forEach(function (row, i) {
				if (row.id === id) {
					row.active = [];

					if (!row.ellapsed_time) {
						row.ellapsed_time = helpers.dateDifference(row.date);
					}

					row.date = moment(row.date).fromNow();

					showTask.push(row);
				} 

				if (row.id !== id && !row.ellapsed_time && showTask[0]) {
					row.ellapsed_time = helpers.dateDifference(row.date);
					showTask[0].active.push(row);
				}
			});

			if (showTask.length > 0) {
				callback(err, showTask);
			} else {
				callback('Task not found');
			}

		} else {
			callback('User not found')
		}
	});
}

/*
 * Add new task to user's array
 * value {Object} - e.g. { login: 'username', name: 'text', date: new Date(), ellapsed_time: '0:40:23' }
 */
exports.addUserTasks = function (value, callback) {
	db.view('tracker/users', { key: value.login }, function (err, doc) {
		if (err) {
			callback(err);
		}

		if (doc.length > 0) {
			var data = doc[0].value;

			data.tasks.push({
				id: value.id,
				name: value.name,
				date: value.date,
				ellapsed_time: value.ellapsed_time
			});
			
			db.merge(data._id, data, function (err, res) {
				callback(err, res);
			});
		} else {
			callback('User not found');
		}
	});
}

/*
 * Update existing task in user's array
 */
exports.updateUserTasks = function (value, callback) {
	db.view('tracker/users', { key: value.login }, function (err, doc) {
		if (doc.length > 0) {
			var data = doc[0].value;

			data.tasks.forEach(function (row, i) {
				if (row.id === value.id) {
					row.ellapsed_time = value.ellapsed_time;
				}
			});

			db.merge(data._id, data, function (err, res) {
				callback(err, res);
			});
		} else {
			callback('User not found');
		}
	});
}

/*
 * Delete specific task by its id
 */
exports.deleteTaskById = function (login, id, callback) {
	db.view('tracker/users', { key: login }, function (err, doc) {
		if (doc.length > 0) {
			var data = doc[0].value;
			
			data.tasks.forEach(function (row, i) {
				if (row.id === id) {
					data.tasks.splice(i, 1);
				}
			});

			db.merge(data._id, data, function (err, res) {
				callback(err, res);
			});
		} else {
			callback('User not found!');
		}
	})
}

/*
 * Get user from db
 */
exports.findUser = function (value, callback) {
	db.view('tracker/users', { key: value.login }, function (err, doc) {
		if (doc.length > 0) {
			var user = doc[0].value;

			// TBD: sha1 algorithm stored passwords with salt
			if (value.password === user.password) {
				callback(err, true);
			} else {
				callback('Password is incorrect');
			}
		} else {
			callback('User not found');
		}
	})
}