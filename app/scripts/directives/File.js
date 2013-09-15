angular.module('hsbApp.FileDirectives', [])

  .directive('fileUpload', ['$compile','$filter', function ($compile, $filter) {

      return {
        restrict: 'A',
        template: '<div class="fileUploadContainer"><input type="file" name="fileUpload" class="fileInput" accept="image/*" /><br><br><span data-ng-show="file.src"><strong>Preview</strong></span><br><img data-ng-src="{{ file.src }}" data-ng-model="file" /></div>',
        replace: true,
        link: function(scope, elem, attrs) {

          // empty array for our files
          scope.files    = [];
          scope.file     = {};
          scope.progress = false;

          var fileUploadContainer = angular.element(elem),
              fileInput = angular.element(elem.find('input'));

          fileInput.bind('change', function(event){
              var files  = event.target.files,
                  file   = files[0];

              if (!files.length) {
                scope.file  = {};
                scope.files = [];
                alert('Please select a file!');
                return;
              }

              if (file.size > 50000) {
                scope.file  = {};
                scope.files = [];
                alert('File size exceeds 50KB limit!');
                return;
              }

              scope.files.push(file);

              // create new FileReader
              var reader = new FileReader();

              reader.onloadend = function(evt) {

                if (evt.target.readyState == FileReader.DONE) { 
            
                  // preview image
                  scope.file.src = evt.target.result;

                  // manually update our view              
                  scope.$apply(function() {
                    scope.$emit('resizeContent');
                  });

                }

              };

              // read file as data url
              reader.readAsDataURL(file);
          
          });

        }
      }

  }]);