angular.module('hsbApp.CardServices', [])

	.factory('$cards', ['$appStorage', '$http', '$q', function ($appStorage, $http, $q) {
		var STORAGE_KEY = 'cards';

		return {
			get: function() {
				var deferred = $q.defer();
				if($appStorage.get(STORAGE_KEY)) {
					return $appStorage.get(STORAGE_KEY);
				} else {
					$http({ method:'GET',url:'/api/cards' })
						.success(function(data,status,headers,request) {
							deferred.resolve(data);
						})
						.error(function(data,status) {
							deferred.reject(status);
						});
					
					return deferred.promise;
				}
			},
			getByClass: function(classId) {
				var deferred = $q.defer();
				if($appStorage.get(STORAGE_KEY)) {
					return $appStorage.get(STORAGE_KEY);
				} else {
					$http({ method:'GET',url:'/api/cards/class/' + classId })
						.success(function(data,status,headers,request) {
							deferred.resolve(data);
						})
						.error(function(data,status) {
							deferred.reject(status);
						});
					
					return deferred.promise;
				}
			},
			getByType: function(typeId) {
				var deferred = $q.defer();
				if($appStorage.get(STORAGE_KEY)) {
					return $appStorage.get(STORAGE_KEY);
				} else {
					$http({ method:'GET',url:'/api/cards/type/' + typeId })
						.success(function(data,status,headers,request) {
							deferred.resolve(data);
						})
						.error(function(data,status) {
							deferred.reject(status);
						});
					
					return deferred.promise;
				}
			},
			getByTypeAndClass: function(typeId, classId) {
				var deferred = $q.defer();
				if($appStorage.get(STORAGE_KEY)) {
					return $appStorage.get(STORAGE_KEY);
				} else {
					$http({ method:'GET',url:'/api/cards/type/' + typeId + '/class/' + classId })
						.success(function(data,status,headers,request) {
							deferred.resolve(data);
						})
						.error(function(data,status) {
							deferred.reject(status);
						});
					
					return deferred.promise;
				}
			}
		};

	}]);