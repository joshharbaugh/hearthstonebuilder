angular.module('hsbApp.DashboardControllers', [])

	.controller('DashboardModuleCtrl',['$scope','cards', function ($scope, cards) {

		$scope.cards = cards;

		$scope.$watch('cards', function(newVal, oldVal) {
			if(newVal) {
				$scope.cards = newVal;
			}
		});

		$scope.gridOptions = { 
			data: 'cards',
			columnDefs: [ 
				{ field:'name', displayName:'Name' },
				{ field:'class', displayName:'Class' },
				{ field:'cost', displayName:'Cost' },
				{ field:'attack', displayName:'Attack' },
				{ field:'health', displayName:'Health' },
				{ field:'type', displayName:'Type' }
			],
			showFilter: true
		};

		$scope.$on('$viewContentLoaded', function() {
			// when the view is loaded
		});

		$scope.onReady();
	}]);
