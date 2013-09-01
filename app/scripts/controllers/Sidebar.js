'use strict';

angular.module('hsbApp')

	.controller('SidebarCtrl',['$scope', function ($scope) {

		$scope.toggleNav = function() {
		  $("#sidebar-wrapper .tab-content").toggle().toggleClass("collapsed");
		  $("#sidebar-wrapper .tab-content").is(":visible") ? $("#content-wrapper").css("margin-left", ($("#sidebar-wrapper").width() + $("#sidebar-wrapper .tab-content").width())) : $("#content-wrapper").css("margin-left", $("#sidebar-wrapper").width());
		};

	}]);