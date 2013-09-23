angular.module('hsbApp.DashboardControllers', [])

	.controller('DashboardModuleCtrl',['$scope', function ($scope) {

		$scope.$on('$viewContentLoaded', function() {
			// when the view is loaded
		});

		$scope.onReady();
	}]);
