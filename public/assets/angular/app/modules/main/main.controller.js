angular.module('app.main')
    .controller('MainController', ['$scope', '$state', '$http', 'AppPaths', function($scope, $state, $http, AppPaths) {
        $scope.data = {};

        $scope.objCount = {};

        $scope.calculateObjCount = function() {
            $http({
                url: '/getObjects',
                method: 'POST'
            })
                .then (function (res) {
                    console.log(res);
                    $scope.objCount.purchase = res.data.purchase;
                    $scope.objCount.rent = res.data.rent;
                })
        };
        $scope.calculateObjCount();

        $scope.searchBtn = function() {
            $state.go('app.searchResult', {adr: $scope.data.adr});
        }
    }]);