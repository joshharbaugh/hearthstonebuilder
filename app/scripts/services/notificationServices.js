angular.module('hsbApp.NotificationServices', [])

  .factory('$growl', ['$rootScope', function ($rootScope) {

      $.extend($.gritter.options, {
        position: 'top-right',
        fade_in_speed: 800,
        fade_out_speed: 1000,
        time: 2000
      });

      return {

        msg: function (title, text, time, sticky) {

          var _time = time || 3000;

          var _sticky = sticky || false;

          $.gritter.add({

            title: title,

            text: text,

            time: _time,

            sticky: _sticky

          });

        }

      };

  }]);