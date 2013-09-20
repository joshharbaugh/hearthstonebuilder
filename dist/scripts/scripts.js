var CONFIG;!function(){var a=window.app.name,b="app/",c="templates/",d=window.app.version;CONFIG={name:a,version:d,baseDirectory:b,templateDirectory:c,templateFileQuerystring:"?v="+d,routing:{prefix:"!",html5Mode:!0},defaultSite:{},viewUrlPrefix:c+"views/",partialUrlPrefix:c+"partials/",templateFileSuffix:"_tpl.html",prepareViewTemplateUrl:function(a){return"/"+this.viewUrlPrefix+a+this.templateFileSuffix+this.templateFileQuerystring}}}(),angular.module("hsbApp.Routes",[]).config(["$routeProvider","$locationProvider","$httpProvider","$stateProvider","$urlRouterProvider",function(a,b,c,d,e){if(CONFIG.routing.html5Mode)b.html5Mode(!0);else{var f=CONFIG.routing.prefix;f&&f.length>0&&b.hashPrefix(f)}e.when("/users","/user/:id").otherwise("/dashboard"),d.state("dashboard",{"abstract":!0,url:"/dashboard",templateUrl:CONFIG.prepareViewTemplateUrl("home/dashboard"),resolve:{cards:["$cards",function(a){return a.get()}],user:["$users",function(a){return a.getCurrent()}],decks:["$decks",function(a){return a.get()}]},controller:["$scope","user",function(a,b){a.viewTitle="Dashboard",a.user=b}]}).state("dashboard.default",{url:"",views:{decks:{controller:"TopDecksCtrl",templateUrl:CONFIG.prepareViewTemplateUrl("deck/top")},build:{templateUrl:CONFIG.prepareViewTemplateUrl("deck/build")}}}).state("cards",{"abstract":!0,url:"/cards",templateUrl:CONFIG.prepareViewTemplateUrl("card/main"),resolve:{cards:["$cards",function(a){return a.get()}],user:["$users",function(a){return a.getCurrent()}]},controller:["$scope","user",function(a,b){a.viewTitle="Cards",a.user=b}]}).state("cards.type",{url:"/:cardType",resolve:{abilityCards:["$cards","$stateParams",function(a){return a.getByType(5)}],heroCards:["$cards","$stateParams",function(a){return a.getByType(3)}],heroPowerCards:["$cards","$stateParams",function(a){return a.getByType(10)}],minionCards:["$cards","$stateParams",function(a){return a.getByType(4)}],weaponCards:["$cards","$stateParams",function(a){return a.getByType(7)}],allCards:["$cards","$stateParams",function(a){return a.get()}]},views:{"":{controller:"CardCtrl",templateUrl:CONFIG.prepareViewTemplateUrl("card/list")}}}).state("users",{"abstract":!0,url:"/users",templateUrl:CONFIG.prepareViewTemplateUrl("user/main"),resolve:{user:["$users",function(a){return a.getCurrent()}]},controller:["$scope","user",function(a,b){a.viewTitle="Users",a.user=b}]}).state("users.profile",{url:"/:username",resolve:{decks:["$stateParams","$decks",function(a,b){return b.getByUsername(a.username)}]},views:{"":{templateUrl:CONFIG.prepareViewTemplateUrl("user/profile"),controller:"UserProfileCtrl"},"decks@users.profile":{templateUrl:CONFIG.prepareViewTemplateUrl("user/profile_decks"),controller:"UserDecksCtrl"}}}).state("users.decks",{url:"/:username/decks",resolve:{decks:["$stateParams","$decks",function(a,b){return b.getByUsername(a.username)}]},views:{"":{templateUrl:CONFIG.prepareViewTemplateUrl("user/decks"),controller:"UserDecksCtrl"}}}).state("users.messages",{url:"/:username/messages",resolve:{messages:["$stateParams","$messages",function(a,b){return b.getByUsername(a.username)}],sent:["$stateParams","$messages",function(a,b){return b.getSentByUsername(a.username)}]},views:{"":{templateUrl:CONFIG.prepareViewTemplateUrl("user/messages"),controller:"UserMessagesCtrl"}}}).state("decks",{"abstract":!0,url:"/decks",templateUrl:CONFIG.prepareViewTemplateUrl("deck/main"),resolve:{user:["$users",function(a){return a.getCurrent()}],decks:["$decks",function(a){return a.get()}]},controller:["$scope","user",function(a,b){a.viewTitle="Decks",a.user=b}]}).state("decks.detail",{url:"/:deckId",resolve:{deck:["$stateParams","$decks",function(a,b){return b.getById(a.deckId)}],rawDeck:["$stateParams","$decks",function(a,b){return b.getById(a.deckId)}],cards:["$stateParams","$decks",function(a,b){var c=b.getById(a.deckId);c.then(function(a){if(a){var b=a.cards;return b}})}],user:["$users",function(a){return a.getCurrent()}]},views:{"":{templateUrl:CONFIG.prepareViewTemplateUrl("deck/detail"),controller:"DeckDetailCtrl"},"summary@decks.detail":{templateUrl:CONFIG.prepareViewTemplateUrl("deck/summary"),controller:"DeckSummaryCtrl"},"stats@decks.detail":{templateUrl:CONFIG.prepareViewTemplateUrl("deck/stats"),controller:"DeckStatsCtrl"}}}).state("deckbuilder",{"abstract":!0,url:"/deckbuilder",resolve:{user:["$users",function(a){return a.getCurrent()}]},templateUrl:CONFIG.prepareViewTemplateUrl("deckbuilder/main"),controller:["$scope","user",function(a,b){a.viewTitle="Deck Builder",a.user=b}]}).state("deckbuilder.default",{url:"/:deckClass",resolve:{classId:["$stateParams","$appScope",function(a,b){var c=0;switch(a.deckClass){case"druid":c=11;break;case"hunter":c=3;break;case"mage":c=8;break;case"paladin":c=2;break;case"priest":c=5;break;case"rogue":c=4;break;case"shaman":c=7;break;case"warlock":c=9;break;case"warrior":c=1;break;default:c=0}b.classId=c}],abilityCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(5,c.classId)}],heroCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(3,c.classId)}],heroPowerCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(10,c.classId)}],minionCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(4,c.classId)}],weaponCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(7,c.classId)}],allCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByClass(c.classId)}]},views:{deck:{templateUrl:CONFIG.prepareViewTemplateUrl("deckbuilder/deck"),controller:"DeckBuilderCtrl"},classCards:{controller:"DeckBuilderCardsCtrl",templateUrl:CONFIG.prepareViewTemplateUrl("deckbuilder/cards")}}}).state("deckbuilder.edit",{url:"/:deckId/:deckClass/edit",resolve:{deck:["$stateParams","$decks",function(a,b){return b.getById(a.deckId)}],classId:["$stateParams","$appScope",function(a,b){var c=0;switch(a.deckClass){case"druid":c=11;break;case"hunter":c=3;break;case"mage":c=8;break;case"paladin":c=2;break;case"priest":c=5;break;case"rogue":c=4;break;case"shaman":c=7;break;case"warlock":c=9;break;case"warrior":c=1;break;default:c=0}b.classId=c}],abilityCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(5,c.classId)}],heroCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(3,c.classId)}],heroPowerCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(10,c.classId)}],minionCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(4,c.classId)}],weaponCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByTypeAndClass(7,c.classId)}],allCards:["$cards","$stateParams","$appScope",function(a,b,c){return a.getByClass(c.classId)}]},views:{deck:{templateUrl:CONFIG.prepareViewTemplateUrl("deckbuilder/deck"),controller:"DeckBuilderEditCtrl"},classCards:{controller:"DeckBuilderCardsCtrl",templateUrl:CONFIG.prepareViewTemplateUrl("deckbuilder/cards")}}}).state("login",{url:"/login",templateUrl:CONFIG.prepareViewTemplateUrl("user/login"),resolve:{user:["$users",function(a){return a.getCurrent()}]},controller:["$scope","user",function(a,b){a.viewTitle="Login",a.user=b,a.onReady()}]}).state("logout",{url:"/logout",controller:["$scope","$http","$state","$rootScope",function(a,b,c,d){a.viewTitle="HearthStone Builder",b.post("/api/logout").success(function(){d.$state.transitionTo("dashboard.default",{})}),a.onReady()}]}).state("register",{url:"/register",templateUrl:CONFIG.prepareViewTemplateUrl("user/register"),controller:"UserRegisterCtrl"})}]).run(["$rootScope","$state","$stateParams",function(a,b,c){a.$state=b,a.$stateParams=c}]);var hsbApp=window.hsbApp=angular.module("hsbApp",["ui","ui.utils","ui.state","ngGrid","ngSanitize","ngCookies","ngResource","hsbApp.AppControllers","hsbApp.DashboardControllers","hsbApp.CardControllers","hsbApp.UserControllers","hsbApp.DeckControllers","hsbApp.MessageControllers","hsbApp.AppServices","hsbApp.UserServices","hsbApp.MessageServices","hsbApp.CardServices","hsbApp.DeckServices","hsbApp.NotificationServices","hsbApp.Routes","hsbApp.FileDirectives"]);angular.module("hsbApp.AppControllers",[]).run(["$rootScope","$appScope",function(a,b){a.$on("$routeChangeStart",function(){b.topScope().onLoading()}),a.$on("$stateChangeStart",function(){b.topScope().onLoading()}),a.onLoading=function(){var a=b.topScope();b.safeApply(function(){a.loading=!0,a.status="loading"},this)},a.onReady=function(){var a=b.topScope();b.safeApply(function(){a.loading=!1,a.status="ready"},this)}}]).controller("AppCtrl",["$appTimer","$appStorage","$location","$scope","$app",function(a,b,c,d,e){d.app=e}]),angular.module("hsbApp.UserControllers",[]).controller("UserProfileCtrl",["$scope","$http","$growl",function(a,b,c){a.passwordVerified=!1,a.$watch("user",function(b){b&&"undefined"!=typeof b.newpassword&&b.newpassword==b.newpasswordconfirm&&(a.passwordVerified=!0)},!0),a.changePassword=function(d){return d.newpassword!==d.newpasswordconfirm?(c.msg("Oops!","The password values do not match."),void 0):(b({method:"PUT",url:"/api/user/"+a.user._id+"/password",data:{password:d.newpassword}}).success(function(){c.msg("Success!","Your password has been updated")}),void 0)},a.saveProfile=function(){if(!a.files[0])return c.msg("Hey!","Nothing changed, so nothing's been saved."),void 0;var d=a.files[0];b({method:"POST",url:"/api/upload",data:{Username:a.user.profile.username,File:"avatars/"+a.user.profile.username+"/"+d.name,ContentType:d.type}}).success(function(e){try{var f=e.upload_url;a.createCORSRequest=function(a,b){var c;return c=new XMLHttpRequest,null!=c.withCredentials?c.open(a,b,!0):"undefined"!=typeof XDomainRequest?(c=new XDomainRequest,c.open(a,b)):c=null,c};var g=a.createCORSRequest("PUT",f);if(!g)return c.msg("Oops!","CORS not supported by your browser"),void 0;g.upload.onprogress=function(b){a.$apply(function(){var c;b.lengthComputable&&(c=Math.round(100*(b.loaded/b.total)),a.uploading=1>c?"Uploading...":100==c?"Saving...":c+"%")})},g.onload=function(){a.$apply(function(){200===g.status?(a.uploading="Upload complete!",b({method:"PUT",url:"/api/user/"+a.user._id,data:{avatar:f}}).success(function(){c.msg("Success!","Your profile has been updated")}),setTimeout(function(){a.$apply(function(){a.uploading=""})},4e3)):c.msg("Oops!","There was an error uploading to Amazon S3. Try again later.")})},g.setRequestHeader("Content-Type",d.type),g.setRequestHeader("x-amz-acl","private"),g.send(d)}catch(h){return c.msg("Error",h),void 0}}).error(function(){c.msg("Error","Something went wrong. :(")})}}]).controller("UserRegisterCtrl",["$scope","$http","$state","$rootScope","$growl",function(a,b,c,d,e){a.viewTitle="Register",a.register=function(){try{var a={username:this.username,password:this.password,display_name:this.display_name};b({method:"POST",url:"/api/user",data:a}).success(function(a){"success"==a.status?d.$state.transitionTo("login",{}):e.msg("Error",a.message)}).error(function(){})}catch(c){}},a.onReady()}]).controller("UserMessagesCtrl",["$scope","$users","messages","sent",function(a,b,c,d){a.messages=c,a.sent=d,a.onReady()}]).controller("UserDecksCtrl",["$scope","user","decks","$stateParams","$rootScope","$decks","$growl","$timeout",function(a,b,c,d,e,f,g,h){if("object"!=typeof b)e.$state.transitionTo("dashboard.default",{});else{var i=b.profile;i.username===d.username?a.userDecks=c:e.$state.transitionTo("dashboard.default",{})}a.deleteDeck=function(b){var d=confirm("Are you sure?");d&&h(function(){if(f.deleteById(b._id),g.msg("Success!","Deck removed."),-1!==c.indexOf(b)){var d=c.indexOf(b);a.userDecks.splice(d,1)}})},a.onReady()}]),angular.module("hsbApp.DashboardControllers",[]).controller("DashboardModuleCtrl",["$scope","cards",function(a,b){a.cards=b,a.$watch("cards",function(b){b&&(a.cards=b)}),a.$on("$viewContentLoaded",function(){}),a.onReady()}]),angular.module("hsbApp").controller("SidebarCtrl",["$scope",function(){}]),angular.module("hsbApp.DeckControllers",[]).controller("TopDecksCtrl",["$scope","$stateParams","decks",function(a,b,c){a.topDecks=c,angular.forEach(a.topDecks,function(b,c){b.length<30&&delete a.topDecks[c]}),a.topDecks=a.topDecks.filter(function(a){return"undefined"!=typeof a}),a.onReady()}]).controller("DeckDetailCtrl",["$scope","$stateParams","deck",function(a,b,c){a.deck=c;var d=a.deck.cards;d.sort(function(a,b){return a.id-b.id});for(var e=0;e<d.length-1;e++)d[e].id==d[e+1].id&&(d[e+1].qty=2,delete d[e]);a.deck.cards=d.filter(function(a){return"undefined"!=typeof a}),a.onReady()}]).controller("DeckSummaryCtrl",["$scope","$stateParams","deck","user","$decks","$users",function(a,b,c,d,e,f){a.userVotedForDeck=!1,a.voting=!0,a.deck=c;var g=f.getByUsername(c.username);g.then(function(b){b&&(a.deckAuthor=b)}),"object"!=typeof d?a.voting=!1:0===d.votes.indexOf(a.deck._id)?a.userVotedForDeck=!0:(a.upVote=function(){a.deck.rating++;var b={rating:a.deck.rating,user_id:d._id,deck_id:a.deck._id},c=e.updateDeckRating(b);c.then(function(b){b&&"success"==b.status&&(a.userVotedForDeck=!0)})},a.downVote=function(){a.deck.rating--;var b={rating:a.deck.rating,user_id:d._id,deck_id:a.deck._id},c=e.updateDeckRating(b);c.then(function(b){b&&"success"==b.status&&(a.userVotedForDeck=!0)})})}]).controller("DeckStatsCtrl",["$scope","deck","cards","rawDeck",function(a,b,c){function d(a){for(var b=1,c=a;c>=1;c--)b*=c;return b}function e(a,b,c,e){var f=d(a-c),g=d(a-c-(b-e)),h=d(b-e),i=d(c),j=d(c-e),k=d(e),l=d(a),m=d(a-b),n=d(b),o=i/(j*k)*f/(g*h),p=l/(m*n);return o/p}function f(a,b,c,d){var f=parseFloat(a);if(d)var g=parseFloat(d);else var g=parseFloat(1);var h=parseFloat(b),i=parseFloat(c);if(!(h>f||i>g)){var j=e(f,h,g,i),k=0;for(yy=i;yy>=0;yy--)k+=e(f,h,g,yy);return Math.round(1e4*j)/1e4}}if(!c){var g=b.cards;a.unfilteredCards=[]}a.stats={type:{ability:[],hero:[],heroPower:[],minion:[],weapon:[]},rarity:{legendary:[],epic:[],rare:[],common:[],free:[]},cost:{zero:[],one:[],two:[],three:[],four:[],five:[],six:[],seven:[],eight:[],nine:[],tenplus:[]}},angular.forEach(g,function(b){b.qty?(a.unfilteredCards.push(b),a.unfilteredCards.push(b)):a.unfilteredCards.push(b),5==parseInt(b.type)&&a.stats.type.ability.push(b),3==parseInt(b.type)&&a.stats.type.hero.push(b),10==parseInt(b.type)&&a.stats.type.heroPower.push(b),4==parseInt(b.type)&&a.stats.type.minion.push(b),7==parseInt(b.type)&&a.stats.type.weapon.push(b),0==parseInt(b.quality)&&a.stats.rarity.free.push(b),1==parseInt(b.quality)&&a.stats.rarity.common.push(b),3==parseInt(b.quality)&&a.stats.rarity.rare.push(b),4==parseInt(b.quality)&&a.stats.rarity.epic.push(b),5==parseInt(b.quality)&&a.stats.rarity.legendary.push(b),0==parseInt(b.cost)&&a.stats.cost.zero.push(b),1==parseInt(b.cost)&&a.stats.cost.one.push(b),2==parseInt(b.cost)&&a.stats.cost.two.push(b),3==parseInt(b.cost)&&a.stats.cost.three.push(b),4==parseInt(b.cost)&&a.stats.cost.four.push(b),5==parseInt(b.cost)&&a.stats.cost.five.push(b),6==parseInt(b.cost)&&a.stats.cost.six.push(b),7==parseInt(b.cost)&&a.stats.cost.seven.push(b),8==parseInt(b.cost)&&a.stats.cost.eight.push(b),9==parseInt(b.cost)&&a.stats.cost.nine.push(b),parseInt(b.cost)>=10&&a.stats.cost.tenplus.push(b)}),a.deckCounter=a.unfilteredCards.length,new Morris.Donut({element:"stats-rarity",data:[{label:"Legendary",value:a.stats.rarity.legendary.length},{label:"Epic",value:a.stats.rarity.epic.length},{label:"Rare",value:a.stats.rarity.rare.length},{label:"Common",value:a.stats.rarity.common.length},{label:"Free",value:a.stats.rarity.free.length}],colors:["#ff8000","#a335ee","#0070dd","#eee","#9d9d9d"]}),new Morris.Donut({element:"stats-type",data:[{label:"Ability",value:a.stats.type.ability.length},{label:"Hero",value:a.stats.type.hero.length},{label:"Hero Power",value:a.stats.type.heroPower.length},{label:"Minion",value:a.stats.type.minion.length},{label:"Weapon",value:a.stats.type.weapon.length}],colors:["#625e7d","#767197","#8a84b0","#9e97c9","#b2aae3"]}),new Morris.Bar({element:"stats-cost",data:[{y:"Zero",value:a.stats.cost.zero.length},{y:"One",value:a.stats.cost.one.length},{y:"Two",value:a.stats.cost.two.length},{y:"Three",value:a.stats.cost.three.length},{y:"Four",value:a.stats.cost.four.length},{y:"Five",value:a.stats.cost.five.length},{y:"Six",value:a.stats.cost.six.length},{y:"Seven",value:a.stats.cost.seven.length},{y:"Eight",value:a.stats.cost.eight.length},{y:"Nine",value:a.stats.cost.nine.length},{y:"Ten +",value:a.stats.cost.tenplus.length}],xkey:"y",ykeys:["value"],labels:["Cost"],barRatio:1,xLabelAngle:35,hideHover:!0,barColors:function(a,b,c){if("bar"===c){var d=Math.ceil(80*a.y/this.ymax);return"hsl(248, 25%, "+d+"%)"}return"#000064"}}),a.startingHandFirst=[],a.startingHandSecond=[];for(var h=0;3>h;h++)a.startingHandFirst.push(Math.floor(Math.random()*a.unfilteredCards.length));for(var h=0;4>h;h++)a.startingHandSecond.push(Math.floor(Math.random()*a.unfilteredCards.length));angular.forEach(a.startingHandFirst,function(b,c){a.startingHandFirst[c]=a.unfilteredCards[b]}),angular.forEach(a.startingHandSecond,function(b,c){a.startingHandSecond[c]=a.unfilteredCards[b]});for(var i in a.deck.cards)if(a.deck.cards.hasOwnProperty(i))if(a.deck.cards[i].probabilities={},a.deck.cards[i].probabilities.first=[],a.deck.cards[i].probabilities.second=[],a.deck.cards[i].qty){a.deck.cards[i].probabilities.first.push(Math.floor(100*f(30,3,1,a.deck.cards[i].qty))+"%"),a.deck.cards[i].probabilities.second.push(Math.floor(100*f(30,4,1,a.deck.cards[i].qty))+"%");for(var h=0;10>h;h++)a.deck.cards[i].probabilities.first.push(Math.floor(100*f(Math.floor(27-h),1,1,a.deck.cards[i].qty))+"%"),a.deck.cards[i].probabilities.second.push(Math.floor(100*f(Math.floor(26-h),1,1,a.deck.cards[i].qty))+"%")}else{a.deck.cards[i].probabilities.first.push(Math.floor(100*f(30,3,1))+"%"),a.deck.cards[i].probabilities.second.push(Math.floor(100*f(30,4,1))+"%");for(var h=0;10>h;h++)a.deck.cards[i].probabilities.first.push(Math.floor(100*f(Math.floor(27-h),1,1))+"%"),a.deck.cards[i].probabilities.second.push(Math.floor(100*f(Math.floor(26-h),1,1))+"%")}a.onReady()}]).controller("DeckBuilderCtrl",["$scope","$stateParams","user","$appStorage","$decks","$rootScope","$timeout","$window","$growl",function(a,b,c,d,e,f,g,h,i){a.deckUser=c,a.deckClass=b.deckClass,a.deckCards=[],a.deckCounter=0;var j=d.get("Deck-"+b.deckClass);j?(a.createdDeck=j,a.deckCards=a.createdDeck.cards,angular.forEach(a.deckCards,function(b,c){null==b?a.deckCards.splice(c,1):a.deckCounter=a.deckCounter+parseInt(b.qty||1)})):a.createdDeck={"class":a.deckClass,cards:a.deckCards},a.$on("addCard",function(b,c){if(0==a.deckCards.length)a.deckCards.push(c.data);else{a.deckCards.push(c.data);var d=a.deckCards;d.sort(function(a,b){return a.id-b.id});for(var e=0;e<d.length-1;e++)d[e].id==d[e+1].id&&(d[e+1].qty=2,delete d[e]);a.deckCards=d.filter(function(a){return"undefined"!=typeof a})}a.deckCounter++}),a.$watch("deckCards",function(c){c&&(a.createdDeck.cards=c,d.put("Deck-"+b.deckClass,a.createdDeck))},!0),a.removeCard=function(b){var c=a.deckCards;if(-1!==c.indexOf(b)){var d=c.indexOf(b);c.splice(d,1)}},a.saveDeck=function(){a.createdDeck.username=a.deckUser.profile.username,a.createdDeck.author=a.deckUser.profile.display_name,a.createdDeck.name=this.deckName,a.createdDeck.description=this.deckDescription||null,a.createdDeck.length=a.deckCounter;var b=e.saveDeck(a.createdDeck);b.then(function(a){a&&("success"==a.status?($("#deckModal").modal("hide"),i.msg("Success",a.message)):i.msg("Error","There was a problem. Try saving again"))})},a.clearDeck=function(){var c=confirm("Are you sure?");c&&g(function(){a.deckCounter=0,a.deckCards=[],a.createdDeck={"class":a.deckClass,cards:a.deckCards},d.erase("Deck-"+b.deckClass),h.location.href="/deckbuilder/"+b.deckClass})},a.onReady()}]).controller("DeckBuilderEditCtrl",["$scope","$stateParams","user","$appStorage","$decks","deck","$rootScope","$timeout","$window","$growl",function(a,b,c,d,e,f,g,h,i,j){if("object"!=typeof c)g.$state.transitionTo("dashboard.default",{});else{var k=c.profile;if(k.username===f.username){a.deckUser=c,a.deckClass=b.deckClass,a.deckCards=[],a.deckName=f.name,a.deckDescription=f.description,a.deckCounter=0,a.createdDeck=f,a.deckCards=a.createdDeck.cards;var l=a.deckCards;l.sort(function(a,b){return a.id-b.id});for(var m=0;m<l.length-1;m++)l[m].id==l[m+1].id&&(l[m+1].qty=2,delete l[m]);a.deckCards=l.filter(function(a){return"undefined"!=typeof a}),angular.forEach(a.deckCards,function(b,c){null==b?a.deckCards.splice(c,1):a.deckCounter=a.deckCounter+parseInt(b.qty||1)}),a.$on("addCard",function(b,c){if(0==a.deckCards.length)a.deckCards.push(c.data);else{a.deckCards.push(c.data);var d=a.deckCards;d.sort(function(a,b){return a.id-b.id});for(var e=0;e<d.length-1;e++)d[e].id==d[e+1].id&&(d[e+1].qty=2,delete d[e]);a.deckCards=d.filter(function(a){return"undefined"!=typeof a})}a.deckCounter++}),a.$watch("deckCards",function(c){c&&(a.createdDeck.cards=c,d.put("Deck-"+b.deckClass,a.createdDeck))},!0),a.removeCard=function(b){var c=a.deckCards;if(-1!==c.indexOf(b)){var d=c.indexOf(b);c.splice(d,1)}},a.saveDeck=function(){a.createdDeck.username=a.deckUser.profile.username,a.createdDeck.author=a.deckUser.profile.display_name,a.createdDeck.name=this.deckName,a.createdDeck.description=this.deckDescription||null,a.createdDeck.length=a.deckCounter;var b=e.updateDeck(a.createdDeck);b.then(function(a){a&&("success"==a.status?($("#deckModal").modal("hide"),j.msg("Success",a.message)):j.msg("Error","There was a problem. Try saving again"))})},a.clearDeck=function(){var c=confirm("Are you sure?");c&&h(function(){a.deckCounter=0,a.deckCards=[],a.createdDeck={"class":a.deckClass,cards:a.deckCards},d.erase("Deck-"+b.deckClass),i.location.href="/deckbuilder/"+b.deckClass})}}else g.$state.transitionTo("dashboard.default",{});a.onReady()}}]).controller("DeckBuilderCardsCtrl",["$rootScope","$scope","allCards","abilityCards","heroCards","heroPowerCards","minionCards","weaponCards",function(a,b,c,d,e,f,g,h){b.cards={},b.cards.all=c,b.cards.ability=d,b.cards.hero=e,b.cards.heroPower=f,b.cards.minion=g,b.cards.weapon=h,b.$watch("cards",function(a){a&&(b.cards=a)}),b.addCard=function(){this.card.disabled||(this.card.remaining=this.card.limit-1,this.card.limit=this.card.remaining,0==this.card.limit&&(this.card.disabled=!0),b.$parent.$broadcast("addCard",{data:this.card}))},b.$parent.$$childHead.$watch("deckCards",function(a){a&&angular.forEach(a,function(a){if(0==a.remaining&&(a.disabled=!0),a.limit&&a.limit>0){switch(parseInt(a.type)){case 5:angular.forEach(b.cards.ability,function(b){b.id==a.id&&(b.limit=1,b.remaining=1)});break;case 3:angular.forEach(b.cards.hero,function(b){b.id==a.id&&(b.limit=1,b.remaining=1)});break;case 10:angular.forEach(b.cards.heroPower,function(b){b.id==a.id&&(b.limit=1,b.remaining=1)});break;case 4:angular.forEach(b.cards.minion,function(b){b.id==a.id&&(b.limit=1,b.remaining=1)});break;case 7:angular.forEach(b.cards.weapon,function(b){b.id==a.id&&(b.limit=1,b.remaining=1)});break;default:return}angular.forEach(b.cards.all,function(b){b.id==a.id&&(b.limit=1,b.remaining=1)})}if(a.disabled){switch(parseInt(a.type)){case 5:angular.forEach(b.cards.ability,function(b){b.id==a.id&&(b.disabled=!0,b.remaining=0,b.limit=0)});break;case 3:angular.forEach(b.cards.hero,function(b){b.id==a.id&&(b.disabled=!0,b.remaining=0,b.limit=0)});break;case 10:angular.forEach(b.cards.heroPower,function(b){b.id==a.id&&(b.disabled=!0,b.remaining=0,b.limit=0)});break;case 4:angular.forEach(b.cards.minion,function(b){b.id==a.id&&(b.disabled=!0,b.remaining=0,b.limit=0)});break;case 7:angular.forEach(b.cards.weapon,function(b){b.id==a.id&&(b.disabled=!0,b.remaining=0,b.limit=0)});break;default:return}angular.forEach(b.cards.all,function(b){b.id==a.id&&(b.disabled=!0,b.remaining=0,b.limit=0)})}})},!0),b.$parent.$$childHead.$watch("deckCounter",function(a){a&&a>=30&&(b.disableAllCards=!0)},!0),b.onReady()}]),angular.module("hsbApp.CardControllers",[]).controller("CardCtrl",["$scope","allCards","abilityCards","heroCards","heroPowerCards","minionCards","weaponCards","$stateParams",function(a,b,c,d,e,f,g){a.cards={},a.cards.all=b,a.cards.ability=c,a.cards.hero=d,a.cards.heroPower=e,a.cards.minion=f,a.cards.weapon=g,a.$watch("cards",function(b){b&&(a.cards=b)}),a.addCard=function(){a.$parent.$broadcast("addCard",{data:this.card})},a.onReady()}]),angular.module("hsbApp.MessageControllers",[]).controller("MessageCtrl",["$scope",function(){}]),angular.module("hsbApp.FileDirectives",[]).directive("fileUpload",["$compile","$filter",function(){return{restrict:"A",template:'<div class="fileUploadContainer"><input type="file" name="fileUpload" class="fileInput" accept="image/*" /><br><br><span data-ng-show="file.src"><strong>Preview</strong></span><br><img data-ng-src="{{ file.src }}" data-ng-model="file" /></div>',replace:!0,link:function(a,b){a.files=[],a.file={},a.progress=!1;var c=(angular.element(b),angular.element(b.find("input")));c.bind("change",function(b){var c=b.target.files,d=c[0];if(!c.length)return a.file={},a.files=[],alert("Please select a file!"),void 0;if(d.size>5e4)return a.file={},a.files=[],alert("File size exceeds 50KB limit!"),void 0;a.files.push(d);var e=new FileReader;e.onloadend=function(b){b.target.readyState==FileReader.DONE&&(a.file.src=b.target.result,a.$apply(function(){a.$emit("resizeContent")}))},e.readAsDataURL(d)})}}}]),angular.module("hsbApp.AppServices",[]).factory("$app",function(){return CONFIG}).factory("$appTimer",function(){var a=500,b=-1;return function(c){clearTimeout(b),b=setTimeout(function(){c()},a)}}).factory("$appStorage",function(){var a="hsb-";return{disableCaching:function(){this.disabled=!0},enableCaching:function(){this.disabled=!1},version:function(){return"1"},prefixKey:function(b){return a+this.version()+"-"+b},put:function(a,b){a=this.prefixKey(a),b=JSON.stringify(b),localStorage.setItem(a,b)},get:function(a){a=this.prefixKey(a);var b=localStorage.getItem(a);return JSON.parse(b)},erase:function(a){a=this.prefixKey(a),localStorage.removeItem(a)},flush:function(){for(;localStorage.length;)localStorage.removeItem(localStorage.key(0))},isPresent:function(a){return this.disabled?!1:!!this.get(a)}}}).factory("$appScope",["$rootScope",function(a){return{topScope:function(){return this.scope(document)},scope:function(a){return angular.element(a).scope()},rootScope:function(){return a},safeApply:function(a,b){b=b||this.topScope(),a=a||function(){},b.$$phase?a():b.$apply(function(){a()})}}}]).factory("$appLocation",["$location","$appScope",function(a,b){return{gotoURL:function(a){window.location=a},change:function(c,d){b.safeApply(function(){a.search(""),a.path(c)},d)},replace:function(c,d){b.safeApply(function(){a.path(c).replace()},d)}}}]).factory("$appSanitize",function(){return{trim:function(a){return a.replace(/^\s+|\s+$/g,"")},urlEncode:function(a){return escape(a)},prepareForUrl:function(a){return a=this.trim(a),a=this.urlEncode(a)}}}),angular.module("hsbApp.UserServices",[]).factory("$users",["$http","$q",function(a,b){return{getCurrent:function(){var c=b.defer();return a({method:"GET",url:"/api/user"}).success(function(a){c.resolve(a)}).error(function(a,b){c.reject(b)}),c.promise},getByUsername:function(c){var d=b.defer();return a({method:"GET",url:"/api/user/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise}}}]),angular.module("hsbApp.MessageServices",[]).factory("$messages",["$http","$q",function(a,b){return{getById:function(c){var d=b.defer();return a({method:"GET",url:"/api/message/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},getByUsername:function(c){var d=b.defer();return a({method:"GET",url:"/api/messages/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},getSentByUsername:function(c){var d=b.defer();return a({method:"GET",url:"/api/messages/"+c+"/sent"}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise}}}]),angular.module("hsbApp.CardServices",[]).factory("$cards",["$appStorage","$http","$q",function(a,b,c){var d="cards";return{get:function(){var e=c.defer();return a.get(d)?a.get(d):(b({method:"GET",url:"/api/cards"}).success(function(a){e.resolve(a)}).error(function(a,b){e.reject(b)}),e.promise)},getById:function(e){var f=c.defer();return a.get(d)?a.get(d):(b({method:"GET",url:"/api/card/"+e}).success(function(a){f.resolve(a)}).error(function(a,b){f.reject(b)}),f.promise)},getByClass:function(e){var f=c.defer();return a.get(d)?a.get(d):(b({method:"GET",url:"/api/cards/class/"+e}).success(function(a){f.resolve(a)}).error(function(a,b){f.reject(b)}),f.promise)},getByType:function(e){var f=c.defer();return a.get(d)?a.get(d):(b({method:"GET",url:"/api/cards/type/"+e}).success(function(a){f.resolve(a)}).error(function(a,b){f.reject(b)}),f.promise)},getByTypeAndClass:function(e,f){var g=c.defer();return a.get(d)?a.get(d):(b({method:"GET",url:"/api/cards/type/"+e+"/class/"+f}).success(function(a){g.resolve(a)}).error(function(a,b){g.reject(b)}),g.promise)}}}]),angular.module("hsbApp.DeckServices",[]).factory("$decks",["$http","$q",function(a,b){return{get:function(){var c=b.defer();return a({method:"GET",url:"/api/decks"}).success(function(a){c.resolve(a)}).error(function(a,b){c.reject(b)}),c.promise},getById:function(c){var d=b.defer();return a({method:"GET",url:"/api/deck/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},getByUsername:function(c){var d=b.defer();return a({method:"GET",url:"/api/decks/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},saveDeck:function(c){var d=b.defer();return a({method:"POST",url:"/api/decks/"+c.username,data:c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},updateDeck:function(c){var d=b.defer();return a({method:"PUT",url:"/api/decks/"+c._id,data:c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},updateDeckRating:function(c){var d=b.defer();return a({method:"PUT",url:"/api/decks/"+c.deck_id+"/rating",data:c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise},deleteById:function(c){var d=b.defer();return a({method:"DELETE",url:"/api/deck/"+c}).success(function(a){d.resolve(a)}).error(function(a,b){d.reject(b)}),d.promise}}}]),angular.module("hsbApp.NotificationServices",[]).factory("$growl",["$rootScope",function(){return $.extend($.gritter.options,{position:"top-right",fade_in_speed:800,fade_out_speed:1e3,time:2e3}),{msg:function(a,b,c,d){var e=c||3e3,f=d||!1;$.gritter.add({title:a,text:b,time:e,sticky:f})}}}]);