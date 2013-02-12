/* App controllers */
'use strict'

/* 
 * Root page login controller driven by $cookies
 */
function LoginCtrl ($scope, $window, $location, $cookies, api) {
	if ($cookies.tlogin) {
		$location.path('/list');
	}

	$scope.form = {};

	$scope.signIn = function() {
		api.save({ action: 'login' }, $scope.form, 
			function (res) {
				$window.location.reload();
			},
			function (err) {
				$scope.failedLogin = err.data;
			});
	};
}

/*
 * All list controller
 * 'GET' all user tasks
 * 'DELETE' task from db
 */
function ListCtrl ($scope, $window, api) {
	$scope.tasks = api.query({ action: 'all', user: $scope.username });

	$scope.deleteTask = function (task_id, index) {
		$scope.loading = true;

		api.remove({ action: 'delete', user: $scope.username, id: task_id }, 
			function (res) {
				$scope.loading = false;
				$scope.tasks.splice(index, 1);
			});
	};
}

/*
 * Tracker page controller
 * 'GET' active timers
 * 'POST' new timer and 'PUT' existing ones (while deleting and stopping)
 */
function TrackerCtrl ($scope, $timeout, api) {
	$scope.tasks = api.query({ action: 'active', user: $scope.username });

	$scope.addTask = function () {
		$scope.loading = true;

		var data = {
			login: $scope.username,
			id: Math.random().toString(16).substring(2, 12), 
			name: $scope.taskName || 'Unnamed task', 
			date: new Date(), 
			ellapsed_time: false 
		};

		api.save({ action: 'new' }, data, 
			function (res) {
				$scope.loading = false;
				$scope.tasks.push(data);
				$scope.taskName = '';
			});
	};

	$scope.deleteTimer = function (task_id, time, index) {
		$scope.loading = true;

		api.update({ action: 'update' }, { login: $scope.username, id: task_id, ellapsed_time: time}, 
			function (res) {
				$scope.loading = false;
				$scope.tasks.splice(index, 1);
			});
	};
}

/*
 * 'GET' specific timer by id
 * (and created after untopped timers in 'active' array)
 */
function OneTimerCtrl ($scope, api, $routeParams, $location) {
	$scope.tasks = api.query({ action: 'task', user: $scope.username, id: $routeParams.id });
}