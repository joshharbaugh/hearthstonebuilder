angular.module('hsbApp.Routes', [])

	.config(['$routeProvider','$locationProvider','$httpProvider','$stateProvider','$urlRouterProvider', function ($routeProvider, $locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

		if(CONFIG.routing.html5Mode) {
			$locationProvider.html5Mode(true);
		}
		else {
			var routingPrefix = CONFIG.routing.prefix;
			if(routingPrefix && routingPrefix.length > 0) {
				$locationProvider.hashPrefix(routingPrefix);
			}
		}

		// For any unmatched url, send to /dashboard
		$urlRouterProvider
			.when('/users', '/user/:id')
			.otherwise("/dashboard");

		$stateProvider
			.state('dashboard', {
				abstract: true,
				url: "/dashboard",
				templateUrl: CONFIG.prepareViewTemplateUrl('home/dashboard'),
				resolve: {
					cards: ['$cards',
					function( $cards ){
						return $cards.get();
					}],
					user: ['$users',
					function( $users ){
						return $users.getCurrent();
					}],
					decks: ['$decks',
					function( $decks ) {
						return $decks.get();
					}]
				},
				controller: ['$scope','user', function($scope, user) {
					$scope.viewTitle = 'HearthStone Builder: Dashboard';
					$scope.user = user;
				}]
			})
			.state('dashboard.default', {
				url: '',
				views: {
					"decks": {
						controller: 'TopDecksCtrl',
						templateUrl: CONFIG.prepareViewTemplateUrl('deck/top')
					},
					"build": {
						templateUrl: CONFIG.prepareViewTemplateUrl('deck/build')
					}
				}
			})
			.state('cards', {
				abstract: true,
				url: "/cards",
				templateUrl: CONFIG.prepareViewTemplateUrl('card/main'),
				resolve: {
					cards: ['$cards',
					function( $cards ){
						return $cards.get();
					}],
					user: ['$users',
					function( $users ){
						return $users.getCurrent();
					}]
				},
				controller: ['$scope','user', function($scope, user) {
					$scope.viewTitle = 'HearthStone Builder: Cards';
					$scope.user = user;
				}]
			})
			.state('cards.type', {
				url: '/:cardType',
				resolve: {
					abilityCards: ['$cards','$stateParams',
					function( $cards, $stateParams ){
						return $cards.getByType( 5 );
					}],
					heroCards: ['$cards','$stateParams',
					function( $cards, $stateParams ){
						return $cards.getByType( 3 );
					}],
					heroPowerCards: ['$cards','$stateParams',
					function( $cards, $stateParams ){
						return $cards.getByType( 10 );
					}],
					minionCards: ['$cards','$stateParams',
					function( $cards, $stateParams ){
						return $cards.getByType( 4 );
					}],
					weaponCards: ['$cards','$stateParams',
					function( $cards, $stateParams ){
						return $cards.getByType( 7 );
					}],
					allCards: ['$cards','$stateParams',
					function( $cards, $stateParams ){
						return $cards.get();
					}]
				},
				views: {
					'': {
						controller: 'CardCtrl',
						templateUrl: CONFIG.prepareViewTemplateUrl('card/list')
					}
				}
			})
			.state('users', {
				abstract: true,
				url: '/users',
				templateUrl: CONFIG.prepareViewTemplateUrl('user/main'),
				resolve: {
					user: ['$users',
					function( $users ){
						return $users.getCurrent();
					}]					
				},
				controller: ['$scope','user', function($scope, user) {
					$scope.viewTitle = 'HearthStone Builder: Users';
					$scope.user = user;
				}]			
			})
			.state('users.profile', {
				url: '/:username',
				resolve: {
					decks: ['$stateParams', '$decks',
					function( $stateParams, $decks ) {
						return $decks.getByUsername($stateParams.username);
					}]
				},
				views: {
					'': {
						templateUrl: CONFIG.prepareViewTemplateUrl('user/profile'),
						controller: 'UserProfileCtrl'
					},
					'decks@users.profile': {
						templateUrl: CONFIG.prepareViewTemplateUrl('user/profile_decks'),
						controller: 'UserDecksCtrl'
					}
				}
			})
			.state('users.decks', {
				url: '/:username/decks',
				resolve: {
					decks: ['$stateParams', '$decks',
					function( $stateParams, $decks ) {
						return $decks.getByUsername($stateParams.username);
					}]
				},
				views: {
					'': {
						templateUrl: CONFIG.prepareViewTemplateUrl('user/decks'),
						controller: 'UserDecksCtrl'
					}
				}
			})
			.state('users.messages', {
				url: '/:username/messages',
				resolve: {
					messages: ['$stateParams', '$messages',
					function( $stateParams, $messages ) {
						return $messages.getByUsername($stateParams.username);
					}],
					sent: ['$stateParams', '$messages',
					function( $stateParams, $messages ) {
						return $messages.getSentByUsername($stateParams.username);
					}]
				},
				views: {
					'': {
						templateUrl: CONFIG.prepareViewTemplateUrl('user/messages'),
						controller: 'UserMessagesCtrl'
					}
				}
			})
			.state('decks', {
				abstract: true,
				url: '/decks',
				templateUrl: CONFIG.prepareViewTemplateUrl('deck/main'),
				resolve: {
					user: ['$users',
					function( $users ){
						return $users.getCurrent();
					}],
					decks: ['$decks',
					function( $decks ) {
						return $decks.get();
					}]
				},
				controller: ['$scope','user', function($scope, user) {
					$scope.viewTitle = 'Decks';
					$scope.user = user;
				}]			
			})
			.state('decks.detail', {
				url: '/:deckId',
				resolve: {
					deck: ['$stateParams', '$decks',
					function($stateParams, $decks) {
						return $decks.getById($stateParams.deckId);
					}],
					cards: ['$stateParams', '$decks',
					function($stateParams, $decks) {
						var deckPromise = $decks.getById($stateParams.deckId);
						deckPromise.then(function(data) {
							if(data) {
								var cards = data.cards;
								return cards;
							}
						});
					}]
				},
				views: {
					'': {
						templateUrl: CONFIG.prepareViewTemplateUrl('deck/detail'),
						controller: 'DeckDetailCtrl'
					},
					'summary@decks.detail': {
						templateUrl: CONFIG.prepareViewTemplateUrl('deck/summary')
					},
					'stats@decks.detail': {
						templateUrl: CONFIG.prepareViewTemplateUrl('deck/stats'),
						controller: 'DeckStatsCtrl'
					}
				}
			})
			.state('deckbuilder', {
				abstract: true,
				url: '/deckbuilder',
				resolve: {
					user: ['$users',
					function( $users ){
						return $users.getCurrent();
					}],
				},
				templateUrl: CONFIG.prepareViewTemplateUrl('deckbuilder/main'),
				controller: ['$scope','user', function($scope, user) {
					$scope.viewTitle = 'HearthStone Builder: Deck Builder';
					$scope.user = user;
				}]			
			})
			.state('deckbuilder.default', {
				url: '/:deckClass',
				resolve: {					
					classId: ['$stateParams','$appScope',
					function( $stateParams, $appScope ) {
						var classId = 0;
						switch($stateParams.deckClass)
						{
							case 'druid':
								classId = 11;
								break;
							case 'hunter':
								classId = 3;
								break;
							case 'mage':
								classId = 8;
								break;
							case 'paladin':
								classId = 2;
								break;
							case 'priest':
								classId = 5;
								break;
							case 'rogue':
								classId = 4;
								break;
							case 'shaman':
								classId = 7;
								break;
							case 'warlock':
								classId = 9;
								break;
							case 'warrior':
								classId = 1;
								break;
							default:
								classId = 0;
						}
						$appScope.classId = classId;
					}],
					abilityCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 5, $appScope.classId );
					}],
					heroCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 3, $appScope.classId );
					}],
					heroPowerCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 10, $appScope.classId );
					}],
					minionCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 4, $appScope.classId );
					}],
					weaponCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 7, $appScope.classId );
					}],
					allCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByClass( $appScope.classId );
					}]
				},
				views: {
					'deck': {
						templateUrl: CONFIG.prepareViewTemplateUrl('deckbuilder/deck'),
						controller: 'DeckBuilderCtrl'
					},
					'classCards': {
						controller: 'DeckBuilderCardsCtrl',
						templateUrl: CONFIG.prepareViewTemplateUrl('deckbuilder/cards')
					}
				}
			})
			.state('deckbuilder.edit', {
				url: '/:deckId/:deckClass/edit',
				resolve: {
					deck: ['$stateParams', '$decks',
					function($stateParams, $decks) {
						return $decks.getById($stateParams.deckId);
					}],
					classId: ['$stateParams','$appScope',
					function( $stateParams, $appScope ) {
						var classId = 0;
						switch($stateParams.deckClass)
						{
							case 'druid':
								classId = 11;
								break;
							case 'hunter':
								classId = 3;
								break;
							case 'mage':
								classId = 8;
								break;
							case 'paladin':
								classId = 2;
								break;
							case 'priest':
								classId = 5;
								break;
							case 'rogue':
								classId = 4;
								break;
							case 'shaman':
								classId = 7;
								break;
							case 'warlock':
								classId = 9;
								break;
							case 'warrior':
								classId = 1;
								break;
							default:
								classId = 0;
						}
						$appScope.classId = classId;
					}],				
					abilityCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 5, $appScope.classId );
					}],
					heroCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 3, $appScope.classId );
					}],
					heroPowerCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 10, $appScope.classId );
					}],
					minionCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 4, $appScope.classId );
					}],
					weaponCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByTypeAndClass( 7, $appScope.classId );
					}],
					allCards: ['$cards','$stateParams','$appScope',
					function( $cards, $stateParams, $appScope ){
						return $cards.getByClass( $appScope.classId );
					}]
				},
				views: {
					'deck': {
						templateUrl: CONFIG.prepareViewTemplateUrl('deckbuilder/deck'),
						controller: 'DeckBuilderEditCtrl'
					},
					'classCards': {
						controller: 'DeckBuilderCardsCtrl',
						templateUrl: CONFIG.prepareViewTemplateUrl('deckbuilder/cards')
					}
				}
			})
			.state('login', {
				url: '/login',
				templateUrl: CONFIG.prepareViewTemplateUrl('user/login'),
				resolve: {
					user: ['$users',
					function( $users ){
						return $users.getCurrent();
					}]
				},
				controller: ['$scope','user', function($scope, user) {
					$scope.viewTitle = 'HearthStone Builder';
					$scope.user = user;
				}]			
			})
			.state('register', {
				url: '/register',
				templateUrl: CONFIG.prepareViewTemplateUrl('user/register'),
				controller: 'UserRegisterCtrl'		
			});

	}]).

	run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
		$rootScope.$state       = $state;
		$rootScope.$stateParams = $stateParams;
	}]);