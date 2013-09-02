angular.module('hsbApp.DashboardControllers', [])

	.controller('DashboardModuleCtrl',['$scope','cards', function ($scope, cards) {

		$scope.cards = cards;

		$scope.$watch('cards', function(newVal, oldVal) {
			if(newVal) {
				$scope.cards = newVal;
			}
		});

		$scope.$on('$viewContentLoaded', function() {
			// when the view is loaded
		});

		$scope.onReady();
	}]);
