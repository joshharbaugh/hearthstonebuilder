angular.module('hsbApp.Filters', [])

    .filter('capitalize', function() {
        return function(input) {
            return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        };
    })

    .filter('slug', function() {
        return function(input) {
            return input.toString().toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w\-]+/g, '')
              .replace(/\-\-+/g, '-')
              .replace(/^-+/, '')
              .replace(/-+$/, '')
        }
    });