'use strict'

angular.module('tracker.services', ['ngResource'])
	.factory('api', function ($resource) {
		return $resource('api/:action/:user/:id', {}, {
			update: { method: 'PUT' }
		});
	})
	.factory('convertTime', function () {
		return function (timeString) {
			if (!timeString) {
				timeString = '0:00:00';
			}

			var arr = timeString.split(':');

			for (var i = 0; i < arr.length; i++) {
				if (!arr[0] && arr[i] !== 0 && arr[i].substr(0,1) === '0') {
					arr[i] = arr[i].substr(1,2);
				}
			}

			return {
				h: parseInt(arr[0]),
				m: parseInt(arr[1]),
				s: parseInt(arr[2])
			};
		};
	});