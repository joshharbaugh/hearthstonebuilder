angular.module('hsbApp.UserControllers', [])

	.controller('UserProfileCtrl',['$scope', function ($scope){
	}])

	.controller('UserRegisterCtrl',['$scope','$http','$state','$rootScope', function ($scope, $http, $state, $rootScope){

		$scope.viewTitle = 'HearthStone Builder';
		$scope.register = function() {

			try {

				var payload = {
					'username': this.username,
					'password': this.password,
					'display_name': this.display_name
				};

				$http({method: 'POST', url: '/api/user', data: payload}).success(function(data, status) {
						if(data.status == "success") {
							$rootScope.$state.transitionTo('login', {});
						} else {
							console.log(data.message);
						}
				}).error(function(data, status) {});

			} catch(e) {}

		};

		$scope.onReady();

	}])

	.controller('UserMessagesCtrl',['$scope','$users','messages','sent', function ($scope, $users, messages, sent){
		$scope.messages = messages;
		$scope.sent     = sent;

		$scope.onReady();
	}])

	.controller('UserDecksCtrl',['$scope','user','decks','$stateParams','$rootScope','$decks', function ($scope, user, decks, $stateParams, $rootScope, $decks){
		if(typeof user !== "object") {
			$rootScope.$state.transitionTo('dashboard.default', {});
		} else {
			var currentUser = user.profile;
			if(currentUser.username === $stateParams.username)
				$scope.userDecks = decks;
			else
				$rootScope.$state.transitionTo('dashboard.default', {});
		}

		$scope.deleteDeck = function(deck) {
			console.log('delete', deck._id);
			$decks.deleteById(deck._id);
		};

		$scope.onReady();
	}]);