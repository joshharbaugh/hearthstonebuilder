angular.module('hsbApp.AppControllers', [])

	.run(['$rootScope', '$appScope', function($rootScope, $appScope) {
		$rootScope.$on("$routeChangeStart", function(event, next, current) {
			$appScope.topScope().onLoading();
		});

		$rootScope.onLoading = function() {
			var $scope = $appScope.topScope();
			$appScope.safeApply(function() {
				$scope.loading = true;
				$scope.status = 'loading';
			},this);
		};

		$rootScope.onReady = function() {
			var $scope = $appScope.topScope();
			$appScope.safeApply(function() {
				$scope.loading = false;
				$scope.status = 'ready';
			},this);
		};
 	}])

	.controller('AppCtrl', ['$appTimer', '$appStorage', '$location', '$scope', '$app', function ($appTimer, $appStorage, $location, $scope, $app) {
		
		$scope.app = $app;
	
	}]);