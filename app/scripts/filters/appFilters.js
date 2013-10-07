angular.module('hsbApp.Filters', [])

    .filter('capitalize', function() {
        return function(input) {
            return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        };
    });