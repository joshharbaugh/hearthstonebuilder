angular.module('hsbApp.DeckControllers', [])

	.controller('TopDecksCtrl',['$scope','$stateParams','decks', function ($scope, $stateParams, decks){

		// GET top decks from resolved promise
		$scope.topDecks = decks;

	}])

	.controller('DeckDetailCtrl',['$scope','$stateParams','deck', function ($scope, $stateParams, deck){

		// GET deck from resolved promise
		$scope.deck = deck;

	}])

	.controller('DeckStatsCtrl',['$scope','deck', function ($scope, deck){

		var stats_rarity = new Morris.Donut({
			element: 'stats-rarity',
			data: [
				{label: "Legendary", value: 2},
				{label: "Epic", value: 8},
				{label: "Rare", value: 10},
				{label: "Common", value: 5},
				{label: "Free", value: 5}
			],
			colors: ['#ff8000', '#a335ee', '#0070dd', '#eee', '#9d9d9d']
		});

		var stats_rarity_2 = new Morris.Bar({
			element: 'stats-rarity-2',
			data: [
				{ y: '', legendary: 2, epic: 8, rare: 10, common: 5, free: 5 }
			],
			xkey: 'y',
			ykeys: ['legendary', 'epic', 'rare', 'common', 'free'],
			labels: ['Legendary', 'Epic', 'Rare', 'Common', 'Free'],
			barColors: ['#ff8000', '#a335ee', '#0070dd', '#eee', '#9d9d9d'],
			hideHover: true
		});

	}])

	.controller('DeckBuilderCtrl',['$scope','$stateParams', function ($scope, $stateParams){

		$scope.deckClass = $stateParams.deckClass;
		$scope.deckCards = [];

		$scope.$on('addCard', function(event, args) {
			$scope.deckCards.push(args.data);
		});

	}])

	.controller('DeckBuilderCardsCtrl',['$scope','cards', function ($scope, cards) {

		var types = {
			5: "Ability",
			3: "Hero",
			10: "Hero Power",
			4: "Minion",
			7: "Weapon"
		};

		$scope.cards = cards;

		$scope.$watch('cards', function(newVal, oldVal) {
			if(newVal) {
				$scope.cards = newVal;
			}
		});

		$scope.$on('$viewContentLoaded', function() {
			// when the view is loaded
		});

		$scope.addCard = function() {
			console.log(this.card);
			$scope.$parent.$broadcast('addCard', {data:this.card});
		};

	}]);