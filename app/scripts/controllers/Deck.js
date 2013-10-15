angular.module('hsbApp.DeckControllers', [])

    .controller('TopDecksCtrl',['$scope','$stateParams','decks', function ($scope, $stateParams, decks){

        // GET top decks from resolved promise
        $scope.topDecks = decks;
        
        angular.forEach($scope.topDecks, function(deck, idx) {

            // remove incomplete decks
            if(deck.length < 30) {
                
                delete $scope.topDecks[idx];
            
            }

        });

        $scope.topDecks = $scope.topDecks.filter( function( el ){ return (typeof el !== "undefined"); } );

        $scope.onReady();

    }])

    .controller('DeckDetailCtrl',['$scope','$stateParams','deck', function ($scope, $stateParams, deck){

        // GET deck from resolved promise
        $scope.deck = deck;

        var cards = $scope.deck.cards;
        cards.sort( function(a,b) { return a.id - b.id; } );

        // delete all duplicates from the array
        for( var i=0; i<cards.length-1; i++ ) {
            if ( cards[i].id == cards[i+1].id ) {
                cards[i+1].qty = 2;
                delete cards[i];
            }
        }

        $scope.deck.cards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );

        $scope.onReady();

    }])

    .controller('DeckSummaryCtrl',['$scope','$stateParams','deck','user','$decks','$users', function ($scope, $stateParams, deck, user, $decks, $users){

        $scope.userVotedForDeck = false;
        $scope.voting = true;

        $scope.deck = deck;
        var deckAuthorPromise = $users.getByUsername(deck.username);
        deckAuthorPromise.then(function(response) {
            if(response) {
                $scope.deckAuthor = response;
            }
        });

        if(typeof user !== "object") {

            $scope.voting = false;            

        } else {

            if(user.votes.indexOf($scope.deck._id) !== -1) {

                $scope.userVotedForDeck = true;

            } else {

                $scope.upVote = function(rating) {
                    $scope.deck.rating++;
                    var payload = {
                        'rating': $scope.deck.rating,
                        'user_id': user._id,
                        'deck_id': $scope.deck._id
                    };
                    var updateRatingPromise = $decks.updateDeckRating(payload);
                    updateRatingPromise.then(function(data) {
                        if(data) {
                            if(data.status == 'success') {
                                $scope.userVotedForDeck = true;
                            } else {}
                        }
                    });
                };

                $scope.downVote = function(rating) {
                    $scope.deck.rating--;
                    var payload = {
                        'rating': $scope.deck.rating,
                        'user_id': user._id,
                        'deck_id': $scope.deck._id
                    };
                    var updateRatingPromise = $decks.updateDeckRating(payload);
                    updateRatingPromise.then(function(data) {
                        if(data) {
                            if(data.status == 'success') {
                                $scope.userVotedForDeck = true;
                            } else {}
                        }
                    });
                };

            }

        }

    }])

    .controller('DeckStatsCtrl',['$scope','deck','cards','rawDeck','$filter', function ($scope, deck, cards, rawDeck, $filter){

        if(!cards) {
            var DeckCards = deck.cards;
            $scope.unfilteredCards = [];
        }

        // stats schema
        $scope.stats = {
            type: {
                ability: [],
                minion: [],
                weapon: []
            },
            rarity: {
                legendary: [],
                epic: [],
                rare: [],
                common: [],
                free: []
            },
            cost: {
                zero: [],
                one: [],
                two: [],
                three: [],
                four: [],
                five: [],
                six: [],
                seven: [],
                eight: [],
                nine: [],
                tenplus: []
            }
        };
        
        // loopthrough and sort 
        angular.forEach(DeckCards, function(obj, idx) {
            if(obj.qty == 2) {
                $scope.unfilteredCards.push(obj);
                $scope.unfilteredCards.push(obj);
            } else {
                $scope.unfilteredCards.push(obj);
            }
            // by type
            if(parseInt(obj.type) == 5) {
                if(obj.qty == 2) {
                    $scope.stats.type.ability.push(obj);
                    $scope.stats.type.ability.push(obj);
                } else {
                    $scope.stats.type.ability.push(obj);
                }
            }
            if(parseInt(obj.type) == 4) {
                if(obj.qty == 2) {
                    $scope.stats.type.minion.push(obj);
                    $scope.stats.type.minion.push(obj);
                } else {
                    $scope.stats.type.minion.push(obj);
                }
            }
            if(parseInt(obj.type) == 7) {
                if(obj.qty == 2) {
                    $scope.stats.type.weapon.push(obj);
                    $scope.stats.type.weapon.push(obj);
                } else {
                    $scope.stats.type.weapon.push(obj);
                }
            }

            // by rarity/quality
            if(parseInt(obj.quality) == 0) {
                if(obj.qty == 2) {
                    $scope.stats.rarity.free.push(obj);
                    $scope.stats.rarity.free.push(obj);
                } else {
                    $scope.stats.rarity.free.push(obj);
                }
            }
            if(parseInt(obj.quality) == 1) {
                if(obj.qty == 2) {
                    $scope.stats.rarity.common.push(obj);
                    $scope.stats.rarity.common.push(obj);
                } else {
                    $scope.stats.rarity.common.push(obj);
                }
            }
            if(parseInt(obj.quality) == 3) {
                if(obj.qty == 2) {
                    $scope.stats.rarity.rare.push(obj);
                    $scope.stats.rarity.rare.push(obj);
                } else {
                    $scope.stats.rarity.rare.push(obj);
                }
            }
            if(parseInt(obj.quality) == 4) {
                if(obj.qty == 2) {
                    $scope.stats.rarity.epic.push(obj);
                    $scope.stats.rarity.epic.push(obj);
                } else {
                    $scope.stats.rarity.epic.push(obj);
                }
            }
            if(parseInt(obj.quality) == 5) {
                if(obj.qty == 2) {
                    $scope.stats.rarity.legendary.push(obj);
                    $scope.stats.rarity.legendary.push(obj);
                } else {
                    $scope.stats.rarity.legendary.push(obj);
                }
            }

            // by cost
            if(parseInt(obj.cost) == 0) {
                if(obj.qty == 2) {
                    $scope.stats.cost.zero.push(obj);
                    $scope.stats.cost.zero.push(obj);
                } else {
                    $scope.stats.cost.zero.push(obj);
                }                
            }
            if(parseInt(obj.cost) == 1) {
                if(obj.qty == 2) {
                    $scope.stats.cost.one.push(obj);
                    $scope.stats.cost.one.push(obj);
                } else {
                    $scope.stats.cost.one.push(obj);
                }
            }
            if(parseInt(obj.cost) == 2) {
                if(obj.qty == 2) {
                    $scope.stats.cost.two.push(obj);
                    $scope.stats.cost.two.push(obj);
                } else {
                    $scope.stats.cost.two.push(obj);
                }
            }
            if(parseInt(obj.cost) == 3) {
                if(obj.qty == 2) {
                    $scope.stats.cost.three.push(obj);
                    $scope.stats.cost.three.push(obj);
                } else {
                    $scope.stats.cost.three.push(obj);
                }
            }
            if(parseInt(obj.cost) == 4) {
                if(obj.qty == 2) {
                    $scope.stats.cost.four.push(obj);
                    $scope.stats.cost.four.push(obj);
                } else {
                    $scope.stats.cost.four.push(obj);
                }
            }
            if(parseInt(obj.cost) == 5) {
                if(obj.qty == 2) {
                    $scope.stats.cost.five.push(obj);
                    $scope.stats.cost.five.push(obj);
                } else {
                    $scope.stats.cost.five.push(obj);
                }
            }
            if(parseInt(obj.cost) == 6) {
                if(obj.qty == 2) {
                    $scope.stats.cost.six.push(obj);
                    $scope.stats.cost.six.push(obj);
                } else {
                    $scope.stats.cost.six.push(obj);
                }
            }
            if(parseInt(obj.cost) == 7) {
                if(obj.qty == 2) {
                    $scope.stats.cost.seven.push(obj);
                    $scope.stats.cost.seven.push(obj);
                } else {
                    $scope.stats.cost.seven.push(obj);
                }
            }
            if(parseInt(obj.cost) == 8) {
                if(obj.qty == 2) {
                    $scope.stats.cost.eight.push(obj);
                    $scope.stats.cost.eight.push(obj);
                } else {
                    $scope.stats.cost.eight.push(obj);
                }
            }
            if(parseInt(obj.cost) == 9) {
                if(obj.qty == 2) {
                    $scope.stats.cost.nine.push(obj);
                    $scope.stats.cost.nine.push(obj);
                } else {
                    $scope.stats.cost.nine.push(obj);
                }
            }
            if(parseInt(obj.cost) >= 10) {
                if(obj.qty == 2) {
                    $scope.stats.cost.tenplus.push(obj);
                    $scope.stats.cost.tenplus.push(obj);
                } else {
                    $scope.stats.cost.tenplus.push(obj);
                }
            }
        });

        $scope.deckCounter = $scope.unfilteredCards.length;

        var stats_rarity_data   = [],
            stats_rarity_colors = ['#ff8000', '#a335ee', '#0070dd', '#eee', '#9d9d9d'],
            stats_type_data     = [],
            stats_type_colors   = ['#625e7d', '#767197', '#8a84b0', '#9e97c9', '#b2aae3'];

        angular.forEach($scope.stats.rarity, function(arr, idx) {
            if(arr)
                stats_rarity_data.push({label: $filter('capitalize')(idx), value: arr.length});
        });

        angular.forEach(stats_rarity_data, function(obj, idx) {
            if(obj.value == 0) {
                stats_rarity_data.splice(idx, 1);
                stats_rarity_colors.splice(idx, 1);
            }
        });

        angular.forEach($scope.stats.type, function(arr, idx) {
            if(arr)
                stats_type_data.push({label: $filter('capitalize')(idx), value: arr.length});
        });

        angular.forEach(stats_type_data, function(obj, idx) {
            if(obj.value == 0) {
                stats_type_data.splice(idx, 1);
                stats_type_colors.splice(idx, 1);
            }
        });
        
        var stats_rarity = new Morris.Donut({
            element: 'stats-rarity',
            data: stats_rarity_data,
            colors: stats_rarity_colors
        });

        var stats_type = new Morris.Donut({
            element: 'stats-type',
            data: stats_type_data,
            colors: stats_type_colors
        });

        var stats_cost = new Morris.Bar({
            element: 'stats-cost',
            data: [
                { 
                    y: 'Zero', 
                    value: $scope.stats.cost.zero.length
                },
                {
                    y: 'One',
                    value: $scope.stats.cost.one.length
                },
                {
                    y: 'Two',
                    value: $scope.stats.cost.two.length
                },
                {
                    y: 'Three',
                    value: $scope.stats.cost.three.length
                },
                {
                    y: 'Four',
                    value: $scope.stats.cost.four.length
                },
                {
                    y: 'Five',
                    value: $scope.stats.cost.five.length
                },
                {
                    y: 'Six',
                    value: $scope.stats.cost.six.length
                },
                {
                    y: 'Seven',
                    value: $scope.stats.cost.seven.length
                },
                {
                    y: 'Eight',
                    value: $scope.stats.cost.eight.length
                },
                {
                    y: 'Nine',
                    value: $scope.stats.cost.nine.length
                },
                {
                    y: 'Ten +',
                    value: $scope.stats.cost.tenplus.length
                }
            ],
            xkey: 'y',
            ykeys: ['value'],
            labels: ['Cost'],
            barRatio: 1,
            xLabelAngle: 35,
            hideHover: true,
            barColors: function (row, series, type) {
                if (type === 'bar') {
                    var blue = Math.ceil(80 * row.y / this.ymax);
                    return 'hsl(248, 25%, ' + blue + '%)';
                }
                else {
                    return '#000064';
                }
            }
        });

        // Random Starting Hand
        $scope.startingHandFirst  = [];
        $scope.startingHandSecond = [];

        for(var i=0; i<3; i++) {
            $scope.startingHandFirst.push(Math.floor((Math.random() * $scope.unfilteredCards.length)));
        }
        
        for(var i=0; i<4; i++) {
            $scope.startingHandSecond.push(Math.floor((Math.random() * $scope.unfilteredCards.length)));
        }
        
        angular.forEach($scope.startingHandFirst, function(cardNumber, idx) {
            $scope.startingHandFirst[idx] = $scope.unfilteredCards[cardNumber];
        });

        angular.forEach($scope.startingHandSecond, function(cardNumber, idx) {
            $scope.startingHandSecond[idx] = $scope.unfilteredCards[cardNumber];
        });

        // Hypergeometric distribution functions
        function fact(n){
            var factv=1;
            for(var i=n;i>=1;i--)
                factv=factv*i;
            return factv;
        }
        function hyper(N,n,k,x){
            var nkf=fact(N-k);
            var nnkx=fact(((N-k)-(n-x)));
            var nxf=fact(n-x);
            var kf=fact(k);
            var kxf=fact(k-x);
            var xf=fact(x);
            var Nf=fact(N);
            var cc=fact(N-n);
            var ff=fact(n);
            var nue=kf/(kxf*xf)*nkf/(nnkx*nxf);
            var den=Nf/(cc*ff);
            return (nue/den);
        }
        function calc(deckSize,draw,success,cardQty) {
            var p=parseFloat(deckSize);
            if(cardQty) {
                var k=parseFloat(cardQty);
            } else {
                var k=parseFloat(1);
            }            
            var n=parseFloat(draw);
            var x=parseFloat(success);
            if(n>p){
                return;
            }
            else if(x>k){
                return;
            }
            var hh=hyper(p,n,k,x);
            var rr=0;
            for(yy=x;yy>=0;yy--)
                rr=rr+hyper(p,n,k,yy);
            return Math.round(hh*10000)/10000;
        }

        // Statistical probabilities using hypergeometric distribution
        // http://en.wikipedia.org/wiki/Hypergeometric_distribution
        for(var idx in $scope.deck.cards) {
            if($scope.deck.cards.hasOwnProperty(idx)) {
                $scope.deck.cards[idx].probabilities = {};
                $scope.deck.cards[idx].probabilities.first = [];
                $scope.deck.cards[idx].probabilities.second = [];

                if($scope.deck.cards[idx].qty) {
                    $scope.deck.cards[idx].probabilities.first.push(Math.floor(calc(30,3,1,$scope.deck.cards[idx].qty)*100) + "%");
                    $scope.deck.cards[idx].probabilities.second.push(Math.floor(calc(30,4,1,$scope.deck.cards[idx].qty)*100) + "%");

                    for(var i=0; i<10; i++) {
                        $scope.deck.cards[idx].probabilities.first.push(Math.floor(calc(Math.floor(27-i),1,1,$scope.deck.cards[idx].qty)*100) + "%");
                        $scope.deck.cards[idx].probabilities.second.push(Math.floor(calc(Math.floor(26-i),1,1,$scope.deck.cards[idx].qty)*100) + "%");
                    }
                } else {
                    $scope.deck.cards[idx].probabilities.first.push(Math.floor(calc(30,3,1)*100) + "%");
                    $scope.deck.cards[idx].probabilities.second.push(Math.floor(calc(30,4,1)*100) + "%");

                    for(var i=0; i<10; i++) {
                        $scope.deck.cards[idx].probabilities.first.push(Math.floor(calc(Math.floor(27-i),1,1)*100) + "%");
                        $scope.deck.cards[idx].probabilities.second.push(Math.floor(calc(Math.floor(26-i),1,1)*100) + "%");
                    }
                }
            }
        }

        $scope.onReady();

    }])

    .controller('DeckBuilderCtrl',['$scope','$stateParams','user','$appStorage','$decks','$rootScope','$timeout','$window','$growl', function ($scope, $stateParams, user, $appStorage, $decks, $rootScope, $timeout, $window, $growl){
        
        $scope.deckUser = user;
        $scope.deckClass = $stateParams.deckClass;
        $scope.deckCards = [];
        $scope.deckCounter = 0;

        var localDeckStorage = $appStorage.get('Deck-' + $stateParams.deckClass);
        
        if(!localDeckStorage) {
            $scope.createdDeck = {
                "class": $scope.deckClass,
                "cards": $scope.deckCards
            };
        } else {
            $scope.createdDeck = localDeckStorage;
            $scope.deckCards = $scope.createdDeck.cards;
            
            // clean up empty objects
            angular.forEach($scope.deckCards, function(card, idx) {
                if(card == null) {
                    $scope.deckCards.splice(idx,1);
                } else {
                    $scope.deckCounter = ($scope.deckCounter + parseInt(card.qty || 1));
                }
            });
        }

        // listeners
        $scope.$on('addCard', function(event, args) {       
            if ($scope.deckCards.length == 0) {
                args.data.qty = 1;
                $scope.deckCards.push(args.data);
            } else {
                args.data.qty = 1;
                $scope.deckCards.push(args.data);
                var cards = $scope.deckCards;
                cards.sort( function(a,b) { return a.id - b.id; } );

                for( var i=0; i<cards.length-1; i++ ) {
                    if ( cards[i].id == cards[i+1].id ) {
                        cards[i+1].qty = 2;
                        delete cards[i];
                    }
                }

                $scope.deckCards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );
            }
            $scope.deckCounter++;                             
        });

        // watchers
        $scope.$watch('deckCards', function(newVal, oldVal) {
            if(newVal) {
                $scope.createdDeck.cards = newVal;
                $appStorage.put('Deck-' + $stateParams.deckClass, $scope.createdDeck);
            }
        }, true);

        // events
        $scope.removeCard = function(card) {
                    
            var cards = $scope.deckCards;

            if(cards.indexOf(card) !== -1) {                
                var idx = cards.indexOf(card);
                if(card.qty == 2) {
                    card.qty--;
                    processCard(1);
                } else {
                    cards.splice(idx, 1);
                    processCard(2);                    
                }
                $scope.deckCards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );
                $scope.deckCounter = $scope.deckCounter - card.qty;

                function processCard(offset) {

                    switch(parseInt(card.type))
                    {
                        case 5:
                            angular.forEach($scope.$$nextSibling.cards.ability, function(_card, i) {
                                if(_card.id == card.id) {
                                    card.disabled = false;
                                    card.limit = offset;
                                    card.remaining = offset;
                                    _card.disabled = false;
                                    _card.limit = offset;
                                    _card.remaining = offset;
                                }
                            });
                            break;
                        case 3:
                            angular.forEach($scope.$$nextSibling.cards.hero, function(_card, i) {
                                if(_card.id == card.id) {
                                    card.disabled = false;
                                    card.limit = offset;
                                    card.remaining = offset;
                                    _card.disabled = false;
                                    _card.limit = offset;
                                    _card.remaining = offset;
                                }
                            });
                            break;
                        case 10:
                            angular.forEach($scope.$$nextSibling.cards.heroPower, function(_card, i) {
                                if(_card.id == card.id) {
                                    card.disabled = false;
                                    card.limit = offset;
                                    card.remaining = offset;
                                    _card.disabled = false;
                                    _card.limit = offset;
                                    _card.remaining = offset;
                                }
                            });
                            break;
                        case 4:
                            angular.forEach($scope.$$nextSibling.cards.minion, function(_card, i) {
                                if(_card.id == card.id) {                                
                                    card.disabled = false;
                                    card.limit = offset;
                                    card.remaining = offset;
                                    _card.disabled = false;
                                    _card.limit = offset;
                                    _card.remaining = offset;
                                }
                            });
                            break;
                        case 7:
                            angular.forEach($scope.$$nextSibling.cards.weapon, function(_card, i) {
                                if(_card.id == card.id) {
                                    card.disabled = false;
                                    card.limit = offset;
                                    card.remaining = offset;
                                    _card.disabled = false;
                                    _card.limit = offset;
                                    _card.remaining = offset;
                                }
                            });
                            break;
                        default:
                            return;
                    }
                    angular.forEach($scope.$$nextSibling.cards.all, function(_card, i) {
                        if(_card.id == card.id) {
                            card.disabled = false;
                            card.limit = offset;
                            card.remaining = offset;
                            _card.disabled = false;
                            _card.limit = offset;
                            _card.remaining = offset;
                        }
                    });

                }
            }

        };

        $scope.saveDeck = function() {
            $scope.createdDeck.username = $scope.deckUser.profile.username;
            $scope.createdDeck.author = $scope.deckUser.profile.display_name;
            $scope.createdDeck.name = this.deckName;
            $scope.createdDeck.description = this.deckDescription || null;
            $scope.createdDeck.length = $scope.deckCounter;
            
            var saveDeckPromise = $decks.saveDeck($scope.createdDeck);
            saveDeckPromise.then(function(data) {
                if(data) {
                    if(data.status == 'success') {
                        $('#deckModal').modal('hide');
                        $growl.msg('Success', data.message);
                    } else {
                        $growl.msg('Error', 'There was a problem. Try saving again');
                    }               
                }
            });
        };

        $scope.clearDeck = function() {
            var c = confirm('Are you sure?');
            if(c) {
                $timeout(function() {
                    $scope.deckCounter = 0;
                    $scope.deckCards = [];
                    $scope.createdDeck = {
                        "class": $scope.deckClass,
                        "cards": $scope.deckCards
                    };
                    $appStorage.erase('Deck-' + $stateParams.deckClass);
                    $window.location.href = '/deckbuilder/' + $stateParams.deckClass;
                });
            }
        };

        $scope.onReady();

    }])

    .controller('DeckBuilderEditCtrl',['$scope','$stateParams','user','$appStorage','$decks','deck','$rootScope','$timeout','$window','$growl', function ($scope, $stateParams, user, $appStorage, $decks, deck, $rootScope, $timeout, $window, $growl){
        if(typeof user !== "object") {
            $rootScope.$state.transitionTo('dashboard.default', {});
        } else {
            var currentUser = user.profile;
            if(currentUser.username === deck.username) {

                $scope.deckUser        = user;
                $scope.deckClass       = $stateParams.deckClass;
                $scope.deckCards       = [];
                $scope.deckName        = deck.name;
                $scope.deckDescription = deck.description;
                $scope.deckCounter     = 0;

                $scope.createdDeck = deck;
                $scope.deckCards   = $scope.createdDeck.cards;

                // prettify our view
                var cards = $scope.deckCards;
                cards.sort( function(a,b) { return a.id - b.id; } );

                // delete all duplicates from the array
                for( var i=0; i<cards.length-1; i++ ) {
                    if ( cards[i].id == cards[i+1].id ) {
                        cards[i+1].qty = 2;
                        delete cards[i];
                    }
                }

                $scope.deckCards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );

                // clean up empty objects
                angular.forEach($scope.deckCards, function(card, idx) {
                    if(card == null) {
                        $scope.deckCards.splice(idx,1);
                    } else {
                        $scope.deckCounter = ($scope.deckCounter + parseInt(card.qty || 1));
                    }
                });
                
                // listeners
                $scope.$on('addCard', function(event, args) {
                    if ($scope.deckCards.length == 0) {
                        args.data.qty = 1;
                        $scope.deckCards.push(args.data);
                    } else {
                        args.data.qty = 1;
                        $scope.deckCards.push(args.data);
                        var cards = $scope.deckCards;
                        cards.sort( function(a,b) { return a.id - b.id; } );

                        for( var i=0; i<cards.length-1; i++ ) {
                            if ( cards[i].id == cards[i+1].id ) {
                                cards[i+1].qty = 2;
                                delete cards[i];
                            }
                        }

                        $scope.deckCards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );
                    }
                    $scope.deckCounter++;
                });

                // watchers
                $scope.$watch('deckCards', function(newVal, oldVal) {
                    if(newVal) {
                        $scope.createdDeck.cards = newVal;
                        $appStorage.put('Deck-' + $stateParams.deckClass, $scope.createdDeck);
                    }
                }, true);

                // events
                $scope.removeCard = function(card) {            
                    
                    var cards = $scope.deckCards;

                    if(cards.indexOf(card) !== -1) {
                        var idx = cards.indexOf(card);
                        if(card.qty == 2) {
                            card.qty--;
                            processCard(1);
                        } else {
                            cards.splice(idx, 1);
                            processCard(2);                    
                        }
                        $scope.deckCards = cards.filter( function( el ){ return (typeof el !== "undefined"); } );
                        $scope.deckCounter = $scope.deckCounter - card.qty;

                        function processCard(offset) {

                            switch(parseInt(card.type))
                            {
                                case 5:
                                    angular.forEach($scope.$$nextSibling.cards.ability, function(_card, i) {
                                        if(_card.id == card.id) {
                                            card.disabled = false;
                                            card.limit = offset;
                                            card.remaining = offset;
                                            _card.disabled = false;
                                            _card.limit = offset;
                                            _card.remaining = offset;
                                        }
                                    });
                                    break;
                                case 3:
                                    angular.forEach($scope.$$nextSibling.cards.hero, function(_card, i) {
                                        if(_card.id == card.id) {
                                            card.disabled = false;
                                            card.limit = offset;
                                            card.remaining = offset;
                                            _card.disabled = false;
                                            _card.limit = offset;
                                            _card.remaining = offset;
                                        }
                                    });
                                    break;
                                case 10:
                                    angular.forEach($scope.$$nextSibling.cards.heroPower, function(_card, i) {
                                        if(_card.id == card.id) {
                                            card.disabled = false;
                                            card.limit = offset;
                                            card.remaining = offset;
                                            _card.disabled = false;
                                            _card.limit = offset;
                                            _card.remaining = offset;
                                        }
                                    });
                                    break;
                                case 4:
                                    angular.forEach($scope.$$nextSibling.cards.minion, function(_card, i) {
                                        if(_card.id == card.id) {                                
                                            card.disabled = false;
                                            card.limit = offset;
                                            card.remaining = offset;
                                            _card.disabled = false;
                                            _card.limit = offset;
                                            _card.remaining = offset;
                                        }
                                    });
                                    break;
                                case 7:
                                    angular.forEach($scope.$$nextSibling.cards.weapon, function(_card, i) {
                                        if(_card.id == card.id) {
                                            card.disabled = false;
                                            card.limit = offset;
                                            card.remaining = offset;
                                            _card.disabled = false;
                                            _card.limit = offset;
                                            _card.remaining = offset;
                                        }
                                    });
                                    break;
                                default:
                                    return;
                            }
                            angular.forEach($scope.$$nextSibling.cards.all, function(_card, i) {
                                if(_card.id == card.id) {
                                    card.disabled = false;
                                    card.limit = offset;
                                    card.remaining = offset;
                                    _card.disabled = false;
                                    _card.limit = offset;
                                    _card.remaining = offset;
                                }
                            });

                        }
                    }

                };

                $scope.saveDeck = function() {
                    $scope.createdDeck.username = $scope.deckUser.profile.username;
                    $scope.createdDeck.author = $scope.deckUser.profile.display_name;
                    $scope.createdDeck.name = this.deckName;
                    $scope.createdDeck.description = this.deckDescription || null;
                    $scope.createdDeck.length = $scope.deckCounter;
                    
                    var updateDeckPromise = $decks.updateDeck($scope.createdDeck);
                    updateDeckPromise.then(function(data) {
                        if(data) {
                            if(data.status == 'success') {
                                $('#deckModal').modal('hide');
                                $growl.msg('Success', data.message);
                            } else {
                                $growl.msg('Error', 'There was a problem. Try saving again');
                            }                
                        }
                    });
                };

                $scope.clearDeck = function() {
                    var c = confirm('Are you sure?');
                    if(c) {
                        $timeout(function() {
                            $scope.deckCounter = 0;
                            $scope.deckCards = [];
                            $scope.createdDeck = {
                                "class": $scope.deckClass,
                                "cards": $scope.deckCards
                            };
                            $appStorage.erase('Deck-' + $stateParams.deckClass);
                            $window.location.href = '/deckbuilder/' + $stateParams.deckClass;
                        });
                    }
                };

            } else {
                $rootScope.$state.transitionTo('dashboard.default', {});
            }

            $scope.onReady();           
        }

    }])

    .controller('DeckBuilderCardsCtrl',['$rootScope','$scope','allCards','abilityCards','heroCards','heroPowerCards','minionCards','weaponCards', function ($rootScope, $scope, allCards, abilityCards, heroCards, heroPowerCards, minionCards, weaponCards) {

        $scope.cards = {};
        $scope.cards.all = allCards;
        $scope.cards.ability = abilityCards;
        $scope.cards.hero = heroCards;
        $scope.cards.heroPower = heroPowerCards;
        $scope.cards.minion = minionCards;
        $scope.cards.weapon = weaponCards;
        
        $scope.$watch('cards', function(newVal, oldVal) {
            if(newVal) {
                $scope.cards = newVal;      
            }
        });

        $scope.addCard = function() {
            if(this.card.disabled) {
                return;
            } else {
                this.card.remaining = this.card.limit - 1;
                this.card.limit = this.card.remaining;
                if(this.card.limit == 0) {
                    this.card.disabled = true;
                }       
                $scope.$parent.$broadcast('addCard', {data:this.card});
            }
        };

        $scope.$parent.$$childHead.$watch('deckCards', function(newVal, oldVal) {
            if(newVal) {
                angular.forEach(newVal, function(card, idx) {

                    //console.log(card);

                    // legendary
                    if(card.quality == 5) {
                        card.disabled = true;
                    }

                    // everything else
                    if(card.remaining == 0 || card.qty == 2) {
                        card.disabled = true;
                    }

                    if(card.limit && card.limit > 0) {
                        switch(parseInt(card.type))
                        {
                            case 5:
                                angular.forEach($scope.cards.ability, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.limit = 1;
                                        _card.remaining = 1;
                                    }
                                });
                                break;
                            case 3:
                                angular.forEach($scope.cards.hero, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.limit = 1;
                                        _card.remaining = 1;
                                    }
                                });
                                break;
                            case 10:
                                angular.forEach($scope.cards.heroPower, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.limit = 1;
                                        _card.remaining = 1;
                                    }
                                });
                                break;
                            case 4:
                                angular.forEach($scope.cards.minion, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.limit = 1;
                                        _card.remaining = 1;
                                    }
                                });
                                break;
                            case 7:
                                angular.forEach($scope.cards.weapon, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.limit = 1;
                                        _card.remaining = 1;
                                    }
                                });
                                break;
                            default:
                                return;
                        }
                        angular.forEach($scope.cards.all, function(_card, i) {
                            if(_card.id == card.id) {
                                _card.limit = 1;
                                _card.remaining = 1;
                            }
                        });
                    }

                    if(card.disabled) {
                        switch(parseInt(card.type))
                        {
                            case 5:
                                angular.forEach($scope.cards.ability, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.disabled = true;
                                        _card.remaining = 0;
                                        _card.limit = 0;
                                    }
                                });
                                break;
                            case 3:
                                angular.forEach($scope.cards.hero, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.disabled = true;
                                        _card.remaining = 0;
                                        _card.limit = 0;
                                    }
                                });
                                break;
                            case 10:
                                angular.forEach($scope.cards.heroPower, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.disabled = true;
                                        _card.remaining = 0;
                                        _card.limit = 0;
                                    }
                                });
                                break;
                            case 4:
                                angular.forEach($scope.cards.minion, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.disabled = true;
                                        _card.remaining = 0;
                                        _card.limit = 0;
                                    }
                                });
                                break;
                            case 7:
                                angular.forEach($scope.cards.weapon, function(_card, i) {
                                    if(_card.id == card.id) {
                                        _card.disabled = true;
                                        _card.remaining = 0;
                                        _card.limit = 0;
                                    }
                                });
                                break;
                            default:
                                return;
                        }
                        angular.forEach($scope.cards.all, function(_card, i) {
                            if(_card.id == card.id) {
                                _card.disabled = true;
                                _card.remaining = 0;
                                _card.limit = 0;
                            }
                        });
                    }
                });
            }
        }, true);

        $scope.$parent.$$childHead.$watch('deckCounter', function(newVal, oldVal) {
            if(newVal) {
                if(newVal >= 30) {
                    $scope.disableAllCards = true;
                } else {
                    $scope.disableAllCards = false;
                }
            }
        }, true);

        $scope.columns = [
            { field: 'cost', title: 'Cost' },
            { field: 'name', title: 'Name' },
            { field: 'attack', title: 'Attack' },
            { field: 'health', title: 'Health' }
        ];

        $scope.sorting = {
            field: 'cost',
            asc: true
        };

        $scope.columnClass = function(field) {
            return this.sorting.field === field ? "sorted sortable col-" + field : "sortable col-" + field;
        };

        $scope.columnSortingIcon = function(field) {
            if(this.sorting.field === field) {
                return this.sorting.asc ? "icon-chevron-up" : "icon-chevron-down";
            } else {
                return "icon-chevron-down";
            }
        };

        $scope.setSorting = function(field) {
            var sorting = this.sorting;
            if(sorting.field === field) {
                sorting.asc = !sorting.asc;
            } else {
                sorting.field = field;
                sorting.asc = true;
            }
        };

        $scope.onReady();

    }]);