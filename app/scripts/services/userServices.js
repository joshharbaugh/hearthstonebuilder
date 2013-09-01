angular.module('hsbApp.UserServices', [])

	.factory('$users', ['$http', '$q', function ($http, $q) {
		
		return {
			getCurrent: function() {
				var deferred = $q.defer();				
				$http({ method:'GET',url:'/api/user' })
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