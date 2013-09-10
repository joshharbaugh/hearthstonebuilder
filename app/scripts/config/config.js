var CONFIG;

(function() {

var appName = 'HearthStone Builder';
var appPrefix = 'app/';
var templateUrlPrefix = 'templates/';
var appVersion = '0.1.0';

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
