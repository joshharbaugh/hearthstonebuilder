angular.module('hsbApp.DashboardControllers', [])

	.controller('DashboardModuleCtrl',['$scope', function ($scope) {

		$scope.$on('$viewContentLoaded', function() {
			// Triggers when the view content is loaded.
		});

		$scope.onReady();
	}]);
