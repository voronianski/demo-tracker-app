/* App module */

'use strict'

var app = angular.module('timeTracker', ['tracker.services', 'tracker.directives', 'ngCookies']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.
		when('/', { templateUrl: 'partials/login', controller: LoginCtrl }).
		when('/list', { templateUrl: 'partials/list', controller: ListCtrl }).
		when('/tracker', { templateUrl: 'partials/tracker', controller: TrackerCtrl }).
		when('/tracker/:id', { templateUrl: 'partials/one-timer', controller: OneTimerCtrl }).
		otherwise({ redirectTo: '/' });

		$locationProvider.html5Mode(true);
}]);

app.run(function ($rootScope, $location, $cookies, $window, api) {
	if ($cookies.tlogin) {
		$rootScope.auth = true;
		$rootScope.username = $cookies.tlogin;

		$rootScope.logout = function() {
			api.save({ action: 'logout' }, { cookie: 'tlogin' },
				function (res) {
					$window.location.reload();
				}, 
				function (err) {
					console.log(err);
				});
		}
	} else {
		$rootScope.auth = false;
		$location.path('/');
	}
})