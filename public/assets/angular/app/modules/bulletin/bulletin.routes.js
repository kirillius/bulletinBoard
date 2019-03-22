angular
    .module('app.bulletin')
    .config(['$stateProvider', 'AppPaths', function($stateProvider, AppPaths) {

        $stateProvider
            .state('app.bulletin', {
                url: 'newBulletin',
                controller: 'BulletinController',
                templateUrl: AppPaths.bulletin + 'templates/step2.html'
                /*templateUrl: AppPaths.bulletin + 'templates/index.html'*/ // FIXME: вернуть
            });
    }]);