angular
    .module('app.main')
    .config(['$stateProvider', 'AppPaths', function($stateProvider, AppPaths) {

        $stateProvider
            .state('app.main', {
                url: '',
                controller: 'MainController',
                templateUrl: AppPaths.main + 'templates/index.html'
            });
    }]);