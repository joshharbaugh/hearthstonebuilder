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
			},
			updateStatus: function(message) {
				var deferred = $q.defer();				
				$http({ method:'PUT',url:'/api/message/' + message._id + '/status',data:{status:message.status} })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
			createMessage: function(message) {
				var deferred = $q.defer();				
				$http({ method:'POST',url:'/api/message',data:{message:message} })
					.success(function(data,status,headers,request) {
						deferred.resolve(data);
					})
					.error(function(data,status) {
						deferred.reject(status);
					});
				return deferred.promise;
			},
			deleteMessage: function(message) {
				var deferred = $q.defer();				
				$http({ method:'DELETE',url:'/api/message/' + message._id })
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