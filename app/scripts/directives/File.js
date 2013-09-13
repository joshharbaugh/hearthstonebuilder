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

                  /* NOTE: moved to next release
                  scope.files.push({
                    'name': file.name, 
                    'type': file.type,
                    'contents': evt.target.result
                  });

                  if (scope.files[0].type == 'text/csv') {                
                    scope.parsedCSV = $filter('csv2array')(scope.files[0].contents);                  
                  }
                  else {
                    alert('Please upload a valid CSV file.');
                    scope.files = [];
                    return;
                  }

                  // add modal with sample data
                  var $modal = $('<div/>').appendTo('body');
                  $modal.addClass('modal fade');
                  $modal.html('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>Sample Data</h3></div><div class="modal-body"><table class="table"><thead><tr><th data-ng-repeat="col in parsedCSV[0]">{{ col }}</th></tr></thead><tbody><tr><td data-ng-repeat="cell in parsedCSV[1]">{{ cell }}</td></tr><tr><td data-ng-repeat="cell in parsedCSV[2]">{{ cell }}</td></tr><tr><td data-ng-repeat="cell in parsedCSV[3]">{{ cell }}</td></tr></tbody></table></div><div class="modal-footer"><a data-dismiss="modal" aria-hidden="true" class="btn">Cancel</a><a data-dismiss="modal" aria-hidden="true" class="btn btn-primary">Accept</a></div>');
                  $compile($modal.contents())(scope);
                  $modal.modal('show');
                  $modal.on('hidden', function() {
                    $modal.remove();
                  });*/

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