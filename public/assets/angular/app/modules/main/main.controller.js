angular.module('app.main')
    .controller('MainController', ['$scope', '$state', '$http', 'AppPaths', function($scope, $state, $http, AppPaths) {
        $scope.data = {};

        $scope.searchBtn = function() {
            $state.go('app.searchResult', {adr: $scope.data.adr});
        }
    }]);