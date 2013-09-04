angular.module('hsbApp.DeckControllers', [])

	.controller('TopDecksCtrl',['$scope','$stateParams','decks', function ($scope, $stateParams, decks){

		// GET top decks from resolved promise
		$scope.topDecks = decks;

	}])

	.controller('DeckDetailCtrl',['$scope','$stateParams','deck', function ($scope, $stateParams, deck){

		// GET deck from resolved promise
		$scope.deck = deck;

	}])

	.controller('DeckStatsCtrl',['$scope','deck','cards', function ($scope, deck, cards){

		if(!cards) {
			var cards = deck.cards;
		}

		// stats schema
		$scope.stats = {
			type: {
				ability: [],
				hero: [],
				heroPower: [],
				minion: [],
				weapon: []
			},
			rarity: {
				legendary: [],
				epic: [],
				rare: [],
				common: [],
				free: []
			},
			cost: {
				zero: [],
				one: [],
				two: [],
				three: [],
				four: [],
				five: [],
				six: [],
				seven: [],
				eight: [],
				nine: [],
				tenplus: []
			}
		};
		
		// loopthrough and sort 
		angular.forEach(cards, function(obj, idx) {
			// by type
			if(parseInt(obj.type) == 5) {
				$scope.stats.type.ability.push(obj);
			}
			if(parseInt(obj.type) == 3) {
				$scope.stats.type.hero.push(obj);
			}
			if(parseInt(obj.type) == 10) {
				$scope.stats.type.heroPower.push(obj);
			}
			if(parseInt(obj.type) == 4) {
				$scope.stats.type.minion.push(obj);
			}
			if(parseInt(obj.type) == 7) {
				$scope.stats.type.weapon.push(obj);
			}

			// by rarity/quality
			if(parseInt(obj.quality) == 0) {
				$scope.stats.rarity.free.push(obj);
			}
			if(parseInt(obj.quality) == 1) {
				$scope.stats.rarity.common.push(obj);
			}
			if(parseInt(obj.quality) == 3) {
				$scope.stats.rarity.rare.push(obj);
			}
			if(parseInt(obj.quality) == 4) {
				$scope.stats.rarity.epic.push(obj);
			}
			if(parseInt(obj.quality) == 5) {
				$scope.stats.rarity.legendary.push(obj);
			}

			// by cost
			if(parseInt(obj.cost) == 0) {
				$scope.stats.cost.zero.push(obj);
			}
			if(parseInt(obj.cost) == 1) {
				$scope.stats.cost.one.push(obj);
			}
			if(parseInt(obj.cost) == 2) {
				$scope.stats.cost.two.push(obj);
			}
			if(parseInt(obj.cost) == 3) {
				$scope.stats.cost.three.push(obj);
			}
			if(parseInt(obj.cost) == 4) {
				$scope.stats.cost.four.push(obj);
			}
			if(parseInt(obj.cost) == 5) {
				$scope.stats.cost.five.push(obj);
			}
			if(parseInt(obj.cost) == 6) {
				$scope.stats.cost.six.push(obj);
			}
			if(parseInt(obj.cost) == 7) {
				$scope.stats.cost.seven.push(obj);
			}
			if(parseInt(obj.cost) == 8) {
				$scope.stats.cost.eight.push(obj);
			}
			if(parseInt(obj.cost) == 9) {
				$scope.stats.cost.nine.push(obj);
			}
			if(parseInt(obj.cost) >= 10) {
				$scope.stats.cost.tenplus.push(obj);
			}
		});

		var stats_rarity = new Morris.Donut({
			element: 'stats-rarity',
			data: [
				{label: "Legendary", value: $scope.stats.rarity.legendary.length},
				{label: "Epic", value: $scope.stats.rarity.epic.length},
				{label: "Rare", value: $scope.stats.rarity.rare.length},
				{label: "Common", value: $scope.stats.rarity.common.length},
				{label: "Free", value: $scope.stats.rarity.free.length}
			],
			colors: ['#ff8000', '#a335ee', '#0070dd', '#eee', '#9d9d9d']
		});

		var stats_type = new Morris.Donut({
			element: 'stats-type',
			data: [
				{label: "Ability", value: $scope.stats.type.ability.length},
				{label: "Hero", value: $scope.stats.type.hero.length},
				{label: "Hero Power", value: $scope.stats.type.heroPower.length},
				{label: "Minion", value: $scope.stats.type.minion.length},
				{label: "Weapon", value: $scope.stats.type.weapon.length}
			],
			colors: ['#625e7d', '#767197', '#8a84b0', '#9e97c9', '#b2aae3']
		});

		var stats_cost = new Morris.Bar({
			element: 'stats-cost',
			data: [
				{ 
					y: 'Zero', 
					value: $scope.stats.cost.zero.length
				},
				{
					y: 'One',
					value: $scope.stats.cost.one.length
				},
				{
					y: 'Two',
					value: $scope.stats.cost.two.length
				},
				{
					y: 'Three',
					value: $scope.stats.cost.three.length
				},
				{
					y: 'Four',
					value: $scope.stats.cost.four.length
				},
				{
					y: 'Five',
					value: $scope.stats.cost.five.length
				},
				{
					y: 'Six',
					value: $scope.stats.cost.six.length
				},
				{
					y: 'Seven',
					value: $scope.stats.cost.seven.length
				},
				{
					y: 'Eight',
					value: $scope.stats.cost.eight.length
				},
				{
					y: 'Nine',
					value: $scope.stats.cost.nine.length
				},
				{
					y: 'Ten +',
					value: $scope.stats.cost.tenplus.length
				}
			],
			xkey: 'y',
			ykeys: ['value'],
			labels: ['Cost'],
			barRatio: 1,
			xLabelAngle: 35,
			barColors: function (row, series, type) {
				if (type === 'bar') {
					var blue = Math.ceil(80 * row.y / this.ymax);
					return 'hsl(248, 25%, ' + blue + '%)';
				}
				else {
					return '#000064';
				}
			}
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
			
			var saveDeckPromise = $decks.saveDeck($scope.createdDeck);
			saveDeckPromise.then(function(data) {
				if(data) {
					if(data.status == 'success') {
						$('#deckModal').modal('hide');
					} else {
						alert('There was a problem. Try saving again.');
					}				
				}
			});
		};

		$scope.clearDeck = function() {
			var c = confirm('Are you sure?');
			if(c) {
				$scope.deckCards = [];
				$appStorage.erase('Deck-' + $stateParams.deckClass);
			}
		};

	}])

	.controller('DeckBuilderEditCtrl',['$scope','$stateParams','user','$appStorage','$decks','deck','$rootScope', function ($scope, $stateParams, user, $appStorage, $decks, deck, $rootScope){
		if(typeof user !== "object") {
			$rootScope.$state.transitionTo('dashboard.default', {});
		} else {
			var currentUser = user.profile;
			if(currentUser.username === deck.username) {

				$scope.deckUser        = user;
				$scope.deckClass       = $stateParams.deckClass;
				$scope.deckCards       = [];
				$scope.deckName        = deck.name;
				$scope.deckDescription = deck.description;

				$scope.createdDeck = deck;
				$scope.deckCards   = $scope.createdDeck.cards;
				
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
					
					var updateDeckPromise = $decks.updateDeck($scope.createdDeck);
					updateDeckPromise.then(function(data) {
						if(data) {
							if(data.status == 'success') {
								$('#deckModal').modal('hide');
							} else {
								alert('There was a problem. Try saving again.');
							}				
						}
					});
				};

				$scope.clearDeck = function() {
					var c = confirm('Are you sure?');
					if(c) {
						$scope.deckCards = [];
						$appStorage.erase('Deck-' + $stateParams.deckClass);
					}
				};

			} else {
				$rootScope.$state.transitionTo('dashboard.default', {});
			}			
		}

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