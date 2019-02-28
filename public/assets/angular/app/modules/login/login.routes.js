angular
    .module('app.login')
    .config(['$stateProvider', 'AppPaths', function($stateProvider, AppPaths) {

        $stateProvider
            .state('app.login', {
                url: 'userLogin',
                controller: 'LoginController',
                templateUrl: AppPaths.login + 'templates/index.html'
            });
    }]);