angular.module('hsbApp.DeckControllers', [])

	.controller('TopDecksCtrl',['$scope','$stateParams','decks', function ($scope, $stateParams, decks){

		// GET top decks from resolved promise
		$scope.topDecks = decks;

		$scope.onReady();

	}])

	.controller('DeckDetailCtrl',['$scope','$stateParams','deck', function ($scope, $stateParams, deck){

		// GET deck from resolved promise
		$scope.deck = deck;

		var cards = $scope.deck.cards;
		cards.sort( function(a,b) { return a.id - b.id; } );

		// delete all duplicates from the array
		for( var i=0; i<cards.length-1; i++ ) {
			if ( cards[i].id == cards[i+1].id ) {
				cards[i+1].qty = 2;
				delete cards[i];
			}
		}

		$scope.deck.cards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );

		$scope.onReady();

	}])

	.controller('DeckSummaryCtrl',['$scope','$stateParams','deck','user','$decks', function ($scope, $stateParams, deck, user, $decks){

		$scope.userVotedForDeck = false;
		$scope.voting = true;

		if(typeof user !== "object") {

			$scope.voting = false;

		} else {
			$scope.deck = deck;

			if(user.votes.indexOf($scope.deck._id) === 0) {

				$scope.userVotedForDeck = true;

			} else {

				$scope.upVote = function(rating) {
					$scope.deck.rating++;
					var payload = {
						'rating': $scope.deck.rating,
						'user_id': user._id,
						'deck_id': $scope.deck._id
					};
					var updateRatingPromise = $decks.updateDeckRating(payload);
					updateRatingPromise.then(function(data) {
						if(data) {
							if(data.status == 'success') {
								$scope.userVotedForDeck = true;
							} else {}
						}
					});
				};

				$scope.downVote = function(rating) {
					$scope.deck.rating--;
					var payload = {
						'rating': $scope.deck.rating,
						'user_id': user._id,
						'deck_id': $scope.deck._id
					};
					var updateRatingPromise = $decks.updateDeckRating(payload);
					updateRatingPromise.then(function(data) {
						if(data) {
							if(data.status == 'success') {
								$scope.userVotedForDeck = true;
							} else {}
						}
					});
				};

			}

		}

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
			hideHover: true,
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

		$scope.onReady();

	}])

	.controller('DeckBuilderCtrl',['$scope','$stateParams','user','$appStorage','$decks','$rootScope', function ($scope, $stateParams, user, $appStorage, $decks, $rootScope){
		
		$scope.deckUser = user;
		$scope.deckClass = $stateParams.deckClass;
		$scope.deckCards = [];
		$scope.deckCounter = 0;

		var localDeckStorage = $appStorage.get('Deck-' + $stateParams.deckClass);
		
		if(!localDeckStorage) {
			$scope.createdDeck = {
				"class": $scope.deckClass,
				"cards": $scope.deckCards
			};
		} else {
			$scope.createdDeck = localDeckStorage;
			$scope.deckCards = $scope.createdDeck.cards;
			
			// clean up empty objects
			angular.forEach($scope.deckCards, function(card, idx) {
				if(card == null) {
					$scope.deckCards.splice(idx,1);
				} else {
					$scope.deckCounter = ($scope.deckCounter + parseInt(card.qty || 1));
				}
			});
		}

		$scope.$on('addCard', function(event, args) {		
			if ($scope.deckCards.length == 0) {
				$scope.deckCards.push(args.data);
			} else {
				$scope.deckCards.push(args.data);
				var cards = $scope.deckCards;
				cards.sort( function(a,b) { return a.id - b.id; } );

				for( var i=0; i<cards.length-1; i++ ) {
					if ( cards[i].id == cards[i+1].id ) {
						cards[i+1].qty = 2;
						delete cards[i];
					}
				}

				$scope.deckCards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );
			}
			$scope.deckCounter++;								
		});

		$scope.$watch('createdDeck', function(newVal, oldVal) {
			if(newVal) {
				console.log(newVal);
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

		$scope.onReady();

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
				$scope.deckCounter     = 0;

				$scope.createdDeck = deck;
				$scope.deckCards   = $scope.createdDeck.cards;

				// prettify our view
				var cards = $scope.deckCards;
				cards.sort( function(a,b) { return a.id - b.id; } );

				// delete all duplicates from the array
				for( var i=0; i<cards.length-1; i++ ) {
					if ( cards[i].id == cards[i+1].id ) {
						cards[i+1].qty = 2;
						delete cards[i];
					}
				}

				$scope.deckCards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );

				// clean up empty objects
				angular.forEach($scope.deckCards, function(card, idx) {
					if(card == null) {
						$scope.deckCards.splice(idx,1);
					} else {
						$scope.deckCounter = ($scope.deckCounter + parseInt(card.qty || 1));
					}
				});
				
				$scope.$on('addCard', function(event, args) {
					if ($scope.deckCards.length == 0) {
						$scope.deckCards.push(args.data);
					} else {
						$scope.deckCards.push(args.data);
						var cards = $scope.deckCards;
						cards.sort( function(a,b) { return a.id - b.id; } );

						for( var i=0; i<cards.length-1; i++ ) {
							if ( cards[i].id == cards[i+1].id ) {
								cards[i+1].qty = 2;
								delete cards[i];
							}
						}

						$scope.deckCards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );
					}
					$scope.deckCounter++;
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

			$scope.onReady();			
		}

	}])

	.controller('DeckBuilderCardsCtrl',['$rootScope','$scope','allCards','abilityCards','heroCards','heroPowerCards','minionCards','weaponCards', function ($rootScope, $scope, allCards, abilityCards, heroCards, heroPowerCards, minionCards, weaponCards) {

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
			if(this.card.disabled) {
				return;
			} else {
				this.card.remaining = this.card.limit - 1;
				this.card.limit = this.card.remaining;
				if(this.card.limit == 0) {
					this.card.disabled = true;
				}		
				$scope.$parent.$broadcast('addCard', {data:this.card});
			}
		};

		$scope.createdDeck = $scope.$parent.$$childHead.createdDeck;

		$scope.$watch('createdDeck', function(newVal, oldVal) {
			if(newVal) {
				angular.forEach(newVal.cards, function(card, idx) {

					if(card.limit && card.limit > 0) {
						switch(parseInt(card.type))
						{
							case 5:
								angular.forEach($scope.cards.ability, function(_card, i) {
									if(_card.id == card.id) {
										_card.limit = 1;
										_card.remaining = 1;
									}
								});
								break;
							case 3:
								angular.forEach($scope.cards.hero, function(_card, i) {
									if(_card.id == card.id) {
										_card.limit = 1;
										_card.remaining = 1;
									}
								});
								break;
							case 10:
								angular.forEach($scope.cards.heroPower, function(_card, i) {
									if(_card.id == card.id) {
										_card.limit = 1;
										_card.remaining = 1;
									}
								});
								break;
							case 4:
								angular.forEach($scope.cards.minion, function(_card, i) {
									if(_card.id == card.id) {
										_card.limit = 1;
										_card.remaining = 1;
									}
								});
								break;
							case 7:
								angular.forEach($scope.cards.weapon, function(_card, i) {
									if(_card.id == card.id) {
										_card.limit = 1;
										_card.remaining = 1;
									}
								});
								break;
							default:
								return;
						}
						angular.forEach($scope.cards.all, function(_card, i) {
							if(_card.id == card.id) {
								_card.limit = 1;
								_card.remaining = 1;
							}
						});
					}

					if(card.disabled) {
						switch(parseInt(card.type))
						{
							case 5:
								angular.forEach($scope.cards.ability, function(_card, i) {
									if(_card.id == card.id) {
										_card.disabled = true;
										_card.remaining = 0;
										_card.limit = 0;
									}
								});
								break;
							case 3:
								angular.forEach($scope.cards.hero, function(_card, i) {
									if(_card.id == card.id) {
										_card.disabled = true;
										_card.remaining = 0;
										_card.limit = 0;
									}
								});
								break;
							case 10:
								angular.forEach($scope.cards.heroPower, function(_card, i) {
									if(_card.id == card.id) {
										_card.disabled = true;
										_card.remaining = 0;
										_card.limit = 0;
									}
								});
								break;
							case 4:
								angular.forEach($scope.cards.minion, function(_card, i) {
									if(_card.id == card.id) {
										_card.disabled = true;
										_card.remaining = 0;
										_card.limit = 0;
									}
								});
								break;
							case 7:
								angular.forEach($scope.cards.weapon, function(_card, i) {
									if(_card.id == card.id) {
										_card.disabled = true;
										_card.remaining = 0;
										_card.limit = 0;
									}
								});
								break;
							default:
								return;
						}
						angular.forEach($scope.cards.all, function(_card, i) {
							if(_card.id == card.id) {
								_card.disabled = true;
								_card.remaining = 0;
								_card.limit = 0;
							}
						});
					}
				});
			}
		});

		$scope.onReady();

	}]);