angular.module('hsbApp.DeckServices', [])

	.factory('$decks', ['$http', '$q', function ($http, $q) {
		
		return {
			get: function() {
				var deferred = $q.defer();				
				$http({ method:'GET',url:'/api/decks' })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
			getById: function(id) {
				var deferred = $q.defer();				
				$http({ method:'GET',url:'/api/deck/' + id })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
			getByUsername: function(username) {
				var deferred = $q.defer();				
				$http({ method:'GET',url:'/api/decks/' + username })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
			saveDeck: function(deckToSave) {
				var deferred = $q.defer();				
				$http({ method:'POST', url:'/api/decks/' + deckToSave.username, data: deckToSave })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
			updateDeck: function(deckToSave) {
				var deferred = $q.defer();				
				$http({ method:'PUT', url:'/api/decks/' + deckToSave._id, data: deckToSave })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
			updateDeckRating: function(payload) {
				var deferred = $q.defer();				
				$http({ method:'PUT', url:'/api/decks/' + payload.deck_id + '/rating', data: payload })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
			deleteById: function(id) {
				var deferred = $q.defer();				
				$http({ method:'DELETE',url:'/api/deck/' + id })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
		};

	}]);