angular
    .module('app.bulletin')
    .config(['$stateProvider', 'AppPaths', function($stateProvider, AppPaths) {

        $stateProvider
            .state('app.bulletin', {
                url: 'newBulletin',
                controller: 'BulletinController',
                templateUrl: AppPaths.bulletin + 'templates/index.html'
            })
            .state('app.bulletinStep2', {
                url: 'newBulletin2',
                controller: 'BulletinController',
                templateUrl: AppPaths.bulletin + 'templates/step2.html'
            })
            .state('app.mainPage', {
                controller: 'MainController',
                templateUrl: AppPaths.main + 'templates/index.html'
            });
    }]);