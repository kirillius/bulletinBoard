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
            $state.go('app.searchResult', $scope.data);
        };

        $scope.searchSaleOrRent = function(sale) {
            $scope.data.sale = sale;
            $state.go('app.searchResult', $scope.data);
        };

        $scope.searchByRooms = function(sale, countRooms) {
            $scope.data.sale = sale;

            $http({
                url: '/roomCountId',
                method: 'POST',
                data: {countRooms}
            })
                .then(function (res) {
                    $scope.data.countRoomsId = res.data.countRoomsId;
                    $scope.data.typeObj = res.data.typeObj;
                    $state.go('app.searchResult', $scope.data);
                });
        }
    }]);