angular.module('hsbApp.AppServices', [])

	.factory('$app', function() {
		return CONFIG;
	})

	.factory('$appTimer', function() {

		var _delay = 500;
		var _timer = -1;

		return function(fn) {
			clearTimeout(_timer);
			_timer = setTimeout(function() {
				fn(); 
			}, _delay);
		};
	})

	.factory('$appStorage', function() {

		var keyPrefix = 'hsb-';

		return {

			disableCaching : function() {
				this.disabled = true;
			},

			enableCaching : function() {
				this.disabled = false;
			},

			version : function() {
				return '1';
			},

			prefixKey : function(key) {
				return keyPrefix + this.version() + '-' + key;
			},

			put : function(key, value) {
				key = this.prefixKey(key);
				value = JSON.stringify(value);
				localStorage.setItem(key, value);
			},

			get : function(key) {
				key = this.prefixKey(key);
				var value = localStorage.getItem(key);
				return JSON.parse(value);
			},

			erase : function(key) {
				key = this.prefixKey(key);
				localStorage.removeItem(key);
			},

			flush : function() {
				while (localStorage.length) localStorage.removeItem(localStorage.key(0));
			},

			isPresent : function(key) {
				if(!this.disabled) {
					return !! this.get(key);
				}
				return false;
			}

		};
	})

	.factory('$appScope', ['$rootScope', function($rootScope) {

		return {

			topScope : function() {
				return this.scope(document);
			},

			scope : function(element) {
				return angular.element(element).scope();
			},

			rootScope : function() {
				return $rootScope;
			},

			safeApply : function(fn, $scope) {
				$scope = $scope || this.topScope();
				fn = fn || function() {};
				if($scope.$$phase) {
					fn();
				}
				else {
					$scope.$apply(function() {
						fn();
					});
				}
			}

		};

 	}])

	.factory('$appLocation', ['$location','$appScope', function($location, $scopeHelper) {

		return {

			gotoURL : function(url) {
				window.location = url;
			},

			change : function(url, $scope) {
				$scopeHelper.safeApply(function() {
					$location.search('');
					$location.path(url);
				}, $scope);
			},

			replace : function(url, $scope) {
				$scopeHelper.safeApply(function() {
					$location.path(url).replace();
				}, $scope);
			}

		};

	}])

	.factory('$appSanitize', function() {

		return {
			trim : function(str) {
				return str.replace(/^\s+|\s+$/g, '');
			},
			urlEncode : function(str) {
				return escape(str);
			},
			prepareForUrl : function(str) {
				str = this.trim(str);
				str = this.urlEncode(str);
				return str;
			}
		}

	});