angular.module('hsbApp.AppControllers', [])

	.run(['$rootScope', '$appScope', function($rootScope, $appScope) {
		$rootScope.$on("$routeChangeStart", function(event, next, current) {
			// Listens for a route change event and triggers a loading animation.
			$appScope.topScope().onLoading();
		});

		$rootScope.$on("$stateChangeStart", function(event, next, current) {
			// Listens for the state change start event in an AngularJS application and triggers
			// the onLoading method on the top scope.
			$appScope.topScope().onLoading();
		});

		$rootScope.onLoading = function() {
			var $scope = $appScope.topScope();
			$appScope.safeApply(function() {
				// Executes immediately, setting $scope properties.
				$scope.loading = true;
				$scope.status = 'loading';
			},this);
		};

		$rootScope.onReady = function() {
			var $scope = $appScope.topScope();
			$appScope.safeApply(function() {
				// Executes immediately when called, updating scope properties.
				$scope.loading = false;
				$scope.status = 'ready';
			},this);
		};
 	}])

	.controller('AppCtrl', ['$appTimer', '$appStorage', '$location', '$scope', '$app', function ($appTimer, $appStorage, $location, $scope, $app) {
		
		$scope.app = $app;

	}]);