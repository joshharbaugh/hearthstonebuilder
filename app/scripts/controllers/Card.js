angular.module('hsbApp.CardControllers', [])

	.controller('CardCtrl',['$scope','allCards','abilityCards','heroCards','heroPowerCards','minionCards','weaponCards','$stateParams', function ($scope, allCards, abilityCards, heroCards, heroPowerCards, minionCards, weaponCards, $stateParams) {

		$scope.cards = {};
		$scope.cards.all = allCards;
		$scope.cards.ability = abilityCards;
		$scope.cards.hero = heroCards;
		$scope.cards.heroPower = heroPowerCards;
		$scope.cards.minion = minionCards;
		$scope.cards.weapon = weaponCards;

		$scope.$watch('cards', function(newVal, oldVal) {
			if(newVal) {
				$scope.cards = newVal;
			}
		});

		$scope.addCard = function() {
			$scope.$parent.$broadcast('addCard', {data:this.card});
		};

	}]);
