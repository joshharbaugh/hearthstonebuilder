var CONFIG;

(function() {

var appName = window.app.name;
var appPrefix = 'app/';
var templateUrlPrefix = 'templates/';
var appVersion = window.app.version;

CONFIG = {

  name: appName,

  version : appVersion,

  baseDirectory : appPrefix,
  templateDirectory : templateUrlPrefix,
  templateFileQuerystring : "?v=" + appVersion,

  routing : {

    prefix : '!',
    html5Mode : true

  },

  defaultSite: {},

  viewUrlPrefix : templateUrlPrefix + 'views/',
  partialUrlPrefix : templateUrlPrefix + 'partials/',

  templateFileSuffix : '_tpl.html',

  prepareViewTemplateUrl : function(url) {
    return '/' + this.viewUrlPrefix + url + this.templateFileSuffix + this.templateFileQuerystring;
  }

};

})();
