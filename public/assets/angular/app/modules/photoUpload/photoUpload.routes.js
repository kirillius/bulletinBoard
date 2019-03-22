angular
    .module('app.photoUpload')
    .config(['$stateProvider', 'AppPaths', function($stateProvider, AppPaths) {

        $stateProvider
            .state('app.photoUpload', {
                url: 'testPhoto',
                controller: 'PhotoUploadController',
                templateUrl: AppPaths.photoUpload + 'templates/index.html'
            });
    }]);