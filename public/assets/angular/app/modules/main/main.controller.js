angular.module('app.main')
    .controller('MainController', ['$scope', '$state', '$http', 'AppPaths', function($scope, $state, $http, AppPaths) {
        $scope.data = {};

        $scope.objCount = {
            /*purchase: {oneRooms: 1, twoRooms: 2, threeRooms: 3, studioRooms: null, apartRooms: null},
            rent: {oneRooms: 4, twoRooms: 5, threeRooms: 6, studioRooms: null, apartRooms: null, dailyRoom: null}*/
        };

        $scope.calculateObjCount = function() {
            console.log($scope.objCount);
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