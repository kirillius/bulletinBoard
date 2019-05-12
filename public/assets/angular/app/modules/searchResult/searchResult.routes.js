angular
    .module('app.searchResult')
    .config(['$stateProvider', 'AppPaths', function($stateProvider, AppPaths) {

        $stateProvider
            .state('app.searchResult', {
                url: 'search',
                controller: 'SearchResultController',
                templateUrl: AppPaths.searchResult + 'templates/index.html',
                params: {adr: null, sale: null, countRoomsId: null, typeObj: null}
            })
    }]);