angular.module('hsbApp.UserControllers', [])

	.controller('UserProfileCtrl',['$scope', function ($scope){
	}])

	.controller('UserRegisterCtrl',['$scope','$http','$state','$rootScope', function ($scope, $http, $state, $rootScope){

		$scope.viewTitle = 'Create an account';
		$scope.register = function() {

			try {

				var payload = {
					'username': this.username,
					'password': this.password,
					'display_name': this.display_name
				};

				$http({method: 'POST', url: '/api/user', data: payload}).success(function(data, status) {
						if(data.status == "success") {
							console.log(data.message);
							$rootScope.$state.transitionTo('login', {});
						} else {
							console.log(data.message);
						}
				}).error(function(data, status) {});

			} catch(e) {}

		};

	}])

	.controller('UserMessagesCtrl',['$scope','$users','messages','sent', function ($scope, $users, messages, sent){
		$scope.messages = messages;
		$scope.sent     = sent;
	}])

	.controller('UserDecksCtrl',['$scope','$users','decks', function ($scope, $users, decks){
		$scope.userDecks = decks;
	}]);