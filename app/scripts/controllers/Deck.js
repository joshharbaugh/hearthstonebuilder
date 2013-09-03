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

	.controller('DeckBuilderCtrl',['$scope','$stateParams','user','$appStorage','$decks', function ($scope, $stateParams, user, $appStorage, $decks){

		$scope.deckUser = user;
		$scope.deckClass = $stateParams.deckClass;
		$scope.deckCards = [];

		var localDeckStorage = $appStorage.get('Deck-' + $stateParams.deckClass);
		
		if(!localDeckStorage) {
			$scope.createdDeck = {
				"class": $scope.deckClass,
				"cards": $scope.deckCards
			};
		} else {
			$scope.createdDeck = localDeckStorage;
			$scope.deckCards = $scope.createdDeck.cards;
		}

		$scope.$on('addCard', function(event, args) {
			$scope.deckCards.push(args.data);
		});

		$scope.$watch('createdDeck', function(newVal, oldVal) {
			if(newVal) {
				$appStorage.put('Deck-' + $stateParams.deckClass, newVal);
			}
		}, true);

		$scope.saveDeck = function() {			
			$scope.createdDeck.username = $scope.deckUser.profile.username;
			$scope.createdDeck.author = $scope.deckUser.profile.display_name;
			$scope.createdDeck.name = this.deckName;
			$scope.createdDeck.description = this.deckDescription;
			console.log('Saving deck...', $scope.createdDeck);
			$decks.saveDeck($scope.createdDeck);
		};

	}])

	.controller('DeckBuilderCardsCtrl',['$scope','allCards','abilityCards','heroCards','heroPowerCards','minionCards','weaponCards', function ($scope, allCards, abilityCards, heroCards, heroPowerCards, minionCards, weaponCards) {

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