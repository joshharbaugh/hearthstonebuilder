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

	}]);