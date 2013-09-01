angular.module('hsbApp.MessageServices', [])

	.factory('$messages', ['$http', '$q', function ($http, $q) {
		
		return {
			getById: function(id) {
				var deferred = $q.defer();				
				$http({ method:'GET',url:'/api/message/' + id })
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
				$http({ method:'GET',url:'/api/messages/' + username })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
			getSentByUsername: function(username) {
				var deferred = $q.defer();				
				$http({ method:'GET',url:'/api/messages/' + username + '/sent' })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			}
		};

	}]);