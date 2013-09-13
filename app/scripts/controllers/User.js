angular.module('hsbApp.UserControllers', [])

    .controller('UserProfileCtrl',['$scope','$http', function ($scope, $http){

        $scope.saveProfile = function() {

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

                    console.log('Oops! CORS not supported');
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
                          $scope.uploading     = 'Upload complete!';
                          console.log('Uploaded to Amazon S3');

                          $http({method: 'PUT', url: '/api/user/' + $scope.user._id, data: { 'avatar': upload_url }}).success(function(response) {
                            console.log(response);
                          });

                          setTimeout(function() {
                            $scope.$apply(function() {
                              $scope.uploading = '';
                            });
                          }, 4000);
                        }
                        else {

                          console.log('Oops! There was an error uploading to Amazon S3');

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

                  console.log('Error!', e);
                  return;

                }

            }).error(function(data) {
                console.log('Something went wrong.');
            });

        };

    }])

    .controller('UserRegisterCtrl',['$scope','$http','$state','$rootScope', function ($scope, $http, $state, $rootScope){

        $scope.viewTitle = 'HearthStone Builder';
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
                            console.log(data.message);
                        }
                }).error(function(data, status) {});

            } catch(e) {}

        };

        $scope.onReady();

    }])

    .controller('UserMessagesCtrl',['$scope','$users','messages','sent', function ($scope, $users, messages, sent){
        $scope.messages = messages;
        $scope.sent     = sent;

        $scope.onReady();
    }])

    .controller('UserDecksCtrl',['$scope','user','decks','$stateParams','$rootScope','$decks', function ($scope, user, decks, $stateParams, $rootScope, $decks){
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
            console.log('delete', deck._id);
            $decks.deleteById(deck._id);
        };

        $scope.onReady();
    }]);