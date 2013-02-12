/* App directives */

'use strict'

angular.module('tracker.directives', [])
	.directive('countup', function ($timeout, api, convertTime) {
		return {
			restrict: 'A',
			link: function ($scope, elem, attrs, ctrl) {
				var date = new Date(),
					timer = convertTime($scope.$eval(attrs.countup)),
					total;

				date.setHours(timer.h, timer.m, timer.s);
				setTime();

				function setTime() {
					var h = date.getHours(),
						m = date.getMinutes(),
						s = date.getSeconds();

					m = (m < 10) ? '0' + m : m;
					s = (s < 10) ? '0' + s : s;

					elem.html(h + ':' + m + ':' + s);
					$scope.timerValue = h + ':' + m + ':' + s;

					date.setSeconds(date.getSeconds() + 1);

					total = $timeout(setTime, 1000); 
				}

				$scope.stopTimer = function(id, time) {
					api.update({ action: 'update' }, { login: $scope.username, id: id, ellapsed_time: time });
					$timeout.cancel(total);
					$scope.showResume = true;
				}

				$scope.resumeTimer = function() {
					total = $timeout(setTime, 1000); 
					$scope.showResume = false;
				}
			}
		}
	});