angular.module('app.searchResult')
    .controller('SearchResultController', ['$scope', '$state', '$http', 'AppPaths', function($scope, $state, $http, AppPaths) {

        $scope.searchPar = {};

        $scope.search = function(sale, adr, typeObj, typeSale, countRooms) {
            $scope.searchPar.sale = sale;
            $scope.searchPar.adr = adr;
            $scope.searchPar.typeObj = typeObj;
            $scope.searchPar.typeSale = typeSale;
            $scope.searchPar.countRooms = countRooms;
            console.log($scope.searchPar);
            $scope.search2($scope.searchPar);
        };

        $scope.search2 = function(searchPar) {//, typeObject, typeSale, countRooms) {
            var doc = document.getElementById('notFound');

            $http({
                url: '/search',
                method: "POST",
                data: searchPar
            })
                .then(function (res) {
                    $scope.result = res.data;
                    console.log('SearchResult: ', $scope.result);
                    doc.innerText = '';
                }, function (err) { // bulletins not found
                    console.log(err.data);
                    $scope.result = null;
                    doc.innerText = 'Объявлений не найдено';
                })
        };

        $scope.search2($state.params);

    }]);