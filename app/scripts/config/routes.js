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
					$scope.viewTitle = 'Dashboard';
					$scope.user = user;
				}]
			})
			.state('dashboard.default', {
				url: '',
				views: {
					"cards": {
						controller: 'DashboardModuleCtrl',
						templateUrl: CONFIG.prepareViewTemplateUrl('home/dashboard/cards')
					},
					"decks": {
						controller: 'TopDecksCtrl',
						templateUrl: CONFIG.prepareViewTemplateUrl('deck/top')
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
					$scope.viewTitle = 'Users';
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
						templateUrl: CONFIG.prepareViewTemplateUrl('user/decks'),
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
				url: '/{deckId:[0-9]{1,4}}',
				resolve: {
					deck: ['$stateParams', '$decks',
					function($stateParams, $decks) {
						return $decks.getById($stateParams.deckId);
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
					$scope.viewTitle = 'Login';
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