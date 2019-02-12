angular
    .module('app', [
        'ui.router',
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ngMessages',
        'ui.bootstrap',
        'ui.select',
        'app.general',
        'app.main',
        'app.bulletin'
    ])
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider', 'AppPaths',
        function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, AppPaths) {

            $stateProvider
                .state('app', {
                    url: '/',
                    controller: 'AppController as app',
                    templateUrl: AppPaths.app + 'templates/index.html',
                    abstract: true
                });

            $urlRouterProvider.otherwise('/');

        }])
    .run(['$rootScope', function($rootScope){
    }]);