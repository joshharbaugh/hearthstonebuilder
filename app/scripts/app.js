var hsbApp = window.hsbApp = angular.module('hsbApp',
  [
    'ui',
    'ui.utils',
    'ui.state',
    'ngGrid',
    'ngSanitize',
    'ngCookies',
    'ngResource',
    'hsbApp.Filters',
    'hsbApp.AppControllers',
    'hsbApp.DashboardControllers',
    'hsbApp.CardControllers',
    'hsbApp.UserControllers',
    'hsbApp.DeckControllers',
    'hsbApp.MessageControllers',
    'hsbApp.AppServices',
    'hsbApp.UserServices',
    'hsbApp.MessageServices',
    'hsbApp.CardServices',
    'hsbApp.DeckServices',
    'hsbApp.NotificationServices',
    'hsbApp.Routes',
    'hsbApp.FileDirectives'
  ]
);