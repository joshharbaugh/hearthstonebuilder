angular.module('hsbApp.UserControllers', [])

    .controller('UserProfileCtrl',['$scope','$http','$growl', function ($scope, $http, $growl){

        $scope.passwordVerified = false;

        $scope.$watch('user', function(newVal, oldVal) {

          if(newVal) {

            if(typeof newVal.newpassword !== 'undefined' && newVal.newpassword == newVal.newpasswordconfirm) {

              $scope.passwordVerified = true;
              
            }

          }

        }, true);

        $scope.changePassword = function(user) {

          if(user.newpassword !== user.newpasswordconfirm) {
            
            $growl.msg('Oops!', 'The password values do not match.');
            return;
          
          } else {

            $http({method: 'PUT', url: '/api/user/' + $scope.user._id + '/password', data: { 'password': user.newpassword }}).success(function(response) {
                              
              $growl.msg('Success!', 'Your password has been updated');
            
            });

          }

        };

        $scope.saveProfile = function() {

            if(!$scope.files[0]) {
              $growl.msg('Hey!', 'Nothing changed, so nothing\'s been saved.');
              return;
            }

            var file = $scope.files[0];

            $http({method: 'POST', url: '/api/upload', data: { 'Username': $scope.user.profile.username, 'File': 'avatars/' + $scope.user.profile.username + '/' + file.name, ContentType: file.type }}).success(function(response) {
                
                try {

                  var upload_url = response.upload_url;                          

                  $scope.createCORSRequest = function(method, url) {
                    var xhr;
                    xhr = new XMLHttpRequest();
                    if (xhr.withCredentials != null) {
                      xhr.open(method, url, true);
                    } else if (typeof XDomainRequest !== "undefined") {
                      xhr = new XDomainRequest();
                      xhr.open(method, url);
                    } else {
                      xhr = null;
                    }
                    return xhr;
                  };

                  var xhr = $scope.createCORSRequest('PUT', upload_url);

                  if (!xhr) {

                    $growl.msg('Oops!', 'CORS not supported by your browser');
                    return;
                  
                  }
                  else {

                    xhr.upload.onprogress = function(e) {
                      $scope.$apply(function() {
                        var percentCompleted;
                        if (e.lengthComputable) {                                   
                          percentCompleted = Math.round(e.loaded / e.total * 100);
                          if (percentCompleted < 1) {
                            $scope.uploading = 'Uploading...';
                          } else if (percentCompleted == 100) {
                            $scope.uploading = 'Saving...';
                          } else {
                            $scope.uploading = percentCompleted + '%';
                          }
                        }
                      });
                    };

                    xhr.onload = function(e) {
                      // Event listener for when the file completed uploading
                      $scope.$apply(function() {                                
                        if (xhr.status === 200) {
                          $scope.uploading = 'Upload complete!';
                          
                          $http({method: 'PUT', url: '/api/user/' + $scope.user._id, data: { 'avatar': upload_url }}).success(function(response) {
                            
                            $growl.msg('Success!', 'Your profile has been updated');
                          
                          });

                          setTimeout(function() {
                            $scope.$apply(function() {
                              $scope.uploading = '';
                            });
                          }, 4000);
                        }
                        else {

                          $growl.msg('Oops!', 'There was an error uploading to Amazon S3. Try again later.');

                        }
                      });
                    };

                    //xhr.setRequestHeader('Content-Encoding', 'gzip');
                    xhr.setRequestHeader('Content-Type', file.type);
                    xhr.setRequestHeader('x-amz-acl', 'private');
                    //xhr.setRequestHeader('x-amz-grant-read', 'uri=http://acs.amazonaws.com/groups/global/AllUsers');
                    xhr.send(file);

                  };                         

                } catch(e) {

                  $growl.msg('Error', e);
                  return;

                }

            }).error(function(data) {
                $growl.msg('Error', 'Something went wrong. :(');
            });

        };

    }])

    .controller('UserRegisterCtrl',['$scope','$http','$state','$rootScope','$growl', function ($scope, $http, $state, $rootScope, $growl){

        $scope.viewTitle = 'Register';
        $scope.register = function() {

            try {

                var payload = {
                    'username': this.username,
                    'password': this.password,
                    'display_name': this.display_name
                };

                $http({method: 'POST', url: '/api/user', data: payload}).success(function(data, status) {
                        if(data.status == "success") {
                            $rootScope.$state.transitionTo('login', {});
                        } else {
                            $growl.msg('Error', data.message);
                        }
                }).error(function(data, status) {});

            } catch(e) {}

        };

        $scope.onReady();

    }])

    .controller('UserLoginCtrl',['$scope','$http','$state','$rootScope','$growl', function ($scope, $http, $state, $rootScope, $growl){

        $rootScope.loginError = false;

        $scope.login = function() {

          try {

            var payload = {
              'username': this.username,
              'password': this.password
            };

            $http({method: 'POST', url: '/login', data: payload}).success(function(data) {

                if(data.status == 'success') {

                  $rootScope.loginError = false;

                  $growl.msg('Welcome back!', data.message);

                  $rootScope.$state.transitionTo('dashboard.default', {});

                } else {

                  $rootScope.loginError = {
                    'message': data.message
                  };

                }

            }).error(function(data) {

                $rootScope.loginError = {
                  'message': data
                };
            
            });

          } catch(e) {}

        };

        $scope.onReady();

    }])

    .controller('UserMessagesCtrl',['$scope','$users','messages','sent','$messages','$rootScope','$growl', function ($scope, $users, messages, sent, $messages, $rootScope, $growl){
        if(typeof $scope.user !== "object") {
          $rootScope.$state.transitionTo('dashboard.default', {});
        } else {
          $scope.messages = messages;
          $scope.sent     = sent;

          $scope.openMessage = function(message) {
            $scope.active_message = message;
            message.status = 'read';
            $messages.updateStatus(message);      
          };

          $scope.markAsUnread = function(message) {
            message.status = 'new';
            $messages.updateStatus(message);
          };

          $scope.deleteMessage = function(message) {
            var deletePromise = $messages.deleteMessage(message);
            deletePromise.then(function(response) {
              if($scope.messages.indexOf(message) !== -1) {
                var idx = $scope.messages.indexOf(message);
                $scope.messages.splice(idx, 1);
              }
            });
          };

          $scope.sendMessage = function(message) {            
            message.from = $scope.user.profile.username;
            console.log(message);
            var sendPromise = $messages.createMessage(message);
            sendPromise.then(function(response) {
              if(response.status == "success") {
                $("#newMessageModal").modal('hide');
              }
            });
          };

          $scope.onReady();
        }
    }])

    .controller('UserDecksCtrl',['$scope','user','decks','$stateParams','$rootScope','$decks','$growl','$timeout', function ($scope, user, decks, $stateParams, $rootScope, $decks, $growl, $timeout){
        if(typeof user !== "object") {
            $rootScope.$state.transitionTo('dashboard.default', {});
        } else {
            var currentUser = user.profile;
            if(currentUser.username === $stateParams.username)
                $scope.userDecks = decks;
            else
                $rootScope.$state.transitionTo('dashboard.default', {});
        }

        $scope.deleteDeck = function(deck) {
            var c = confirm('Are you sure?');
            if(c) {
                $timeout(function() {                  
                  $decks.deleteById(deck._id);
                  $growl.msg('Success!', 'Deck removed.');
                  if(decks.indexOf(deck) !== -1) {
                    var idx = decks.indexOf(deck);
                    $scope.userDecks.splice(idx, 1);
                  }
                });
            }
        };

        $scope.onReady();
    }]);