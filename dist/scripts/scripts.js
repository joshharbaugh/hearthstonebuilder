var CONFIG;!function(){var a="HearthStone Builder",b="app/",c="templates/",d="0.1.0";CONFIG={name:a,version:d,baseDirectory:b,templateDirectory:c,templateFileQuerystring:"?v="+d,routing:{prefix:"",html5Mode:!1},defaultSite:{},viewUrlPrefix:c+"views/",partialUrlPrefix:c+"partials/",templateFileSuffix:"_tpl.html",prepareViewTemplateUrl:function(a){return"/"+this.viewUrlPrefix+a+this.templateFileSuffix+this.templateFileQuerystring}}}(),angular.module("hsbApp.Routes",[]).config(["$routeProvider","$locationProvider","$httpProvider","$stateProvider","$urlRouterProvider",function(a,b,c,d,e){if(CONFIG.routing.html5Mode)b.html5Mode(!0);else{var f=CONFIG.routing.prefix;f&&f.length>0&&b.hashPrefix(f)}e.when("/users","/user/:id").otherwise("/dashboard"),d.state("dashboard",{"abstract":!0,url:"/dashboard",templateUrl:CONFIG.prepareViewTemplateUrl("home/dashboard"),resolve:{cards:["$cards",function(a){return a.get()}],user:["$users",function(a){return a.getCurrent()}],decks:["$decks",function(a){return a.get()}]},controller:["$scope","user",function(a,b){a.viewTitle="Dashboard",a.user=b}]}).state("dashboard.default",{url:"",views:{decks:{controller:"TopDecksCtrl",templateUrl:CONFIG.prepareViewTemplateUrl("deck/top")},build:{templateUrl:CONFIG.prepareViewTemplateUrl("deck/build")}}}).state("users",{"abstract":!0,url:"/users",templateUrl:CONFIG.prepareViewTemplateUrl("user/main"),resolve:{user:["$users",function(a){return a.getCurrent()}]},controller:["$scope","user",function(a,b){a.viewTitle="Users",a.user=b}]}).state("users.profile",{url:"/:username",resolve:{decks:["$stateParams","$decks",function(a,b){return b.getByUsername(a.username)}]},views:{"":{templateUrl:CONFIG.prepareViewTemplateUrl("user/profile"),controller:"UserProfileCtrl"},"decks@users.profile":{templateUrl:CONFIG.prepareViewTemplateUrl("user/decks"),controller:"UserDecksCtrl"}}}).state("users.decks",{url:"/:username/decks",resolve:{decks:["$stateParams","$decks",function(a,b){return b.getByUsername(a.username)}]},views:{"":{templateUrl:CONFIG.prepareViewTemplateUrl("user/decks"),controller:"UserDecksCtrl"}}}).state("users.messages",{url:"/:username/messages",resolve:{messages:["$stateParams","$messages",function(a,b){return b.getByUsername(a.username)}],sent:["$stateParams","$messages",function(a,b){return b.getSentByUsername(a.username)}]},views:{"":{templateUrl:CONFIG.prepareViewTemplateUrl("user/messages"),controller:"UserMessagesCtrl"}}}).state("decks",{"abstract":!0,url:"/decks",templateUrl:CONFIG.prepareViewTemplateUrl("deck/main"),resolve:{user:["$users",function(a){return a.getCurrent()}],decks:["$decks",function(a){return a.get()}]},controller:["$scope","user",function(a,b){a.viewTitle="Decks",a.user=b}]}).state("decks.detail",{url:"/{deckId:[0-9]{1,4}}",resolve:{deck:["$stateParams","$decks",function(a,b){return b.getById(a.deckId)}]},views:{"":{templateUrl:CONFIG.prepareViewTemplateUrl("deck/detail"),controller:"DeckDetailCtrl"},"summary@decks.detail":{templateUrl:CONFIG.prepareViewTemplateUrl("deck/summary")},"stats@decks.detail":{templateUrl:CONFIG.prepareViewTemplateUrl("deck/stats"),controller:"DeckStatsCtrl"}}}).state("deckbuilder",{"abstract":!0,url:"/deckbuilder",templateUrl:CONFIG.prepareViewTemplateUrl("deckbuilder/main"),controller:["$scope",function(a){a.viewTitle="DeckBuilder"}]}).state("deckbuilder.default",{url:"/:deckClass",resolve:{cards:["$cards",function(a){return a.get()}]},views:{deck:{templateUrl:CONFIG.prepareViewTemplateUrl("deckbuilder/deck"),controller:"DeckBuilderCtrl"},classCards:{controller:"DeckBuilderCardsCtrl",templateUrl:CONFIG.prepareViewTemplateUrl("deckbuilder/cards")}}}).state("login",{url:"/login",templateUrl:CONFIG.prepareViewTemplateUrl("user/login"),resolve:{user:["$users",function(a){return a.getCurrent()}]},controller:["$scope","user",function(a,b){a.viewTitle="Login",a.user=b}]}).state("register",{url:"/register",templateUrl:CONFIG.prepareViewTemplateUrl("user/register"),controller:"UserRegisterCtrl"})}]).run(["$rootScope","$state","$stateParams",function(a,b,c){a.$state=b,a.$stateParams=c}]);var hsbApp=window.hsbApp=angular.module("hsbApp",["ui","ui.utils","ui.state","ngGrid","ngSanitize","ngCookies","ngResource","hsbApp.AppControllers","hsbApp.DashboardControllers","hsbApp.UserControllers","hsbApp.DeckControllers","hsbApp.MessageControllers","hsbApp.AppServices","hsbApp.UserServices","hsbApp.MessageServices","hsbApp.CardServices","hsbApp.DeckServices","hsbApp.Routes"]);angular.module("hsbApp.AppControllers",[]).run(["$rootScope","$appScope",function(a,b){a.$on("$routeChangeStart",function(){b.topScope().onLoading()}),a.onLoading=function(){var a=b.topScope();b.safeApply(function(){a.loading=!0,a.status="loading"},this)},a.onReady=function(){var a=b.topScope();b.safeApply(function(){a.loading=!1,a.status="ready"},this)}}]).controller("AppCtrl",["$appTimer","$appStorage","$location","$scope","$app",function(a,b,c,d,e){d.app=e}]),angular.module("hsbApp.UserControllers",[]).controller("UserProfileCtrl",["$scope",function(){}]).controller("UserRegisterCtrl",["$scope","$http","$state","$rootScope",function(a,b,c,d){a.viewTitle="Create an account",a.register=function(){try{var a={username:this.username,password:this.password,display_name:this.display_name};b({method:"POST",url:"/api/user",data:a}).success(function(a){"success"==a.status?(console.log(a.message),d.$state.transitionTo("login",{})):console.log(a.message)}).error(function(){})}catch(c){}}}]).controller("UserMessagesCtrl",["$scope","$users","messages","sent",function(a,b,c,d){a.messages=c,a.sent=d}]).controller("UserDecksCtrl",["$scope","$users","decks",function(a,b,c){a.userDecks=c}]),angular.module("hsbApp.DashboardControllers",[]).controller("DashboardModuleCtrl",["$scope","cards",function(a,b){a.cards=b,a.$watch("cards",function(b){b&&(a.cards=b)}),a.$on("$viewContentLoaded",function(){}),a.onReady()}]),angular.module("hsbApp").controller("SidebarCtrl",["$scope",function(){}]),angular.module("hsbApp.DeckControllers",[]).controller("TopDecksCtrl",["$scope","$stateParams","decks",function(a,b,c){a.topDecks=c}]).controller("DeckDetailCtrl",["$scope","$stateParams","deck",function(a,b,c){a.deck=c}]).controller("DeckStatsCtrl",["$scope","deck",function(){new Morris.Donut({element:"stats-rarity",data:[{label:"Legendary",value:2},{label:"Epic",value:8},{label:"Rare",value:10},{label:"Common",value:5},{label:"Free",value:5}],colors:["#ff8000","#a335ee","#0070dd","#eee","#9d9d9d"]}),new Morris.Bar({element:"stats-rarity-2",data:[{y:"",legendary:2,epic:8,rare:10,common:5,free:5}],xkey:"y",ykeys:["legendary","epic","rare","common","free"],labels:["Legendary","Epic","Rare","Common","Free"],barColors:["#ff8000","#a335ee","#0070dd","#eee","#9d9d9d"],hideHover:!0})}]).controller("DeckBuilderCtrl",["$scope","$stateParams",function(a,b){a.deckClass=b.deckClass,a.deckCards=[],a.$on("addCard",function(b,c){a.deckCards.push(c.data)})}]).controller("DeckBuilderCardsCtrl",["$scope","cards",function(a,b){a.cards=b,a.$watch("cards",function(b){b&&(a.cards=b)}),a.$on("$viewContentLoaded",function(){}),a.addCard=function(){console.log(this.card),a.$parent.$broadcast("addCard",{data:this.card})}}]),angular.module("hsbApp.MessageControllers",[]).controller("MessageCtrl",["$scope",function(){}]),angular.module("hsbApp.AppServices",[]).factory("$app",function(){return CONFIG}).factory("$appTimer",function(){var a=500,b=-1;return function(c){clearTimeout(b),b=setTimeout(function(){c()},a)}}).factory("$appStorage",function(){var a="hsb-";return{disableCaching:function(){this.disabled=!0},enableCaching:function(){this.disabled=!1},version:function(){return"1"},prefixKey:function(b){return a+this.version()+"-"+b},put:function(a,b){a=this.prefixKey(a),b=JSON.stringify(b),localStorage.setItem(a,b)},get:function(a){a=this.prefixKey(a);var b=localStorage.getItem(a);return JSON.parse(b)},erase:function(a){a=this.prefixKey(a),localStorage.removeItem(a)},flush:function(){for(;localStorage.length;)localStorage.removeItem(localStorage.key(0))},isPresent:function(a){return this.disabled?!1:!!this.get(a)}}}).factory("$appScope",["$rootScope",function(a){return{topScope:function(){return this.scope(document)},scope:function(a){return angular.element(a).scope()},rootScope:function(){return a},safeApply:function(a,b){b=b||this.topScope(),a=a||function(){},b.$$phase?a():b.$apply(function(){a()})}}}]).factory("$appLocation",["$location","$appScope",function(a,b){return{gotoURL:function(a){window.location=a},change:function(c,d){b.safeApply(function(){a.search(""),a.path(c)},d)},replace:function(c,d){b.safeApply(function(){a.path(c).replace()},d)}}}]).factory("$appSanitize",function(){return{trim:function(a){return a.replace(/^\s+|\s+$/g,"")},urlEncode:function(a){return escape(a)},prepareForUrl:function(a){return a=this.trim(a),a=this.urlEncode(a)}}}),angular.module("hsbApp.UserServices",[]).factory("$users",["$http","$q",function(a,b){return{getCurrent:function(){var c=b.defer();return a({method:"GET",url:"/api/user"}).success(function(a){c.resolve(a)}).error(function(a,b){c.reject(b)}),c.promise}}}]),angular.module("hsbApp.MessageServices",[]).factory("$messages",["$http","$q",function(a,b){return{getById:function(c){var d=b.defer();return a({method:"GET",url:"/api/message/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},getByUsername:function(c){var d=b.defer();return a({method:"GET",url:"/api/messages/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},getSentByUsername:function(c){var d=b.defer();return a({method:"GET",url:"/api/messages/"+c+"/sent"}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise}}}]),angular.module("hsbApp.CardServices",[]).factory("$cards",["$appStorage","$http","$q",function(a,b,c){var d="cards";return{get:function(){var e=c.defer();return a.get(d)?a.get(d):(b({method:"GET",url:"/api/cards"}).success(function(a){e.resolve(a)}).error(function(a,b){e.reject(b)}),e.promise)}}}]),angular.module("hsbApp.DeckServices",[]).factory("$decks",["$http","$q",function(a,b){return{get:function(){var c=b.defer();return a({method:"GET",url:"/api/decks"}).success(function(a){c.resolve(a)}).error(function(a,b){c.reject(b)}),c.promise},getById:function(c){var d=b.defer();return a({method:"GET",url:"/api/deck/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},getByUsername:function(c){var d=b.defer();return a({method:"GET",url:"/api/decks/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise}}}]);