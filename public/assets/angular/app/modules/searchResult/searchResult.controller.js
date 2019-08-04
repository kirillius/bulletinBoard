angular.module('app.searchResult')
    .controller('SearchResultController', ['$scope', '$state', '$http', 'AppPaths', 'rest', 'Parameters', 'ParametersByName', function($scope, $state, $http, AppPaths, rest, Parameters, ParametersByName) {

        $scope.searchPar = {
            typeId: $state.params.typeObj,
            countRooms: $state.params.countRoomsId
        };
        $scope.adr = $state.params.adr;
        $scope.sale = $state.params.sale;

        $scope.parametersList = {};
        $scope.getTypes = function() {
            rest.get('types').then(function(types) {
                $scope.types= types;
            });
        };
        $scope.getTypes();

        $scope.ParametersByName = ParametersByName.reload();

        $scope.loadItemsSelect = function(parameterId, parameterName) {
            return Parameters.get({id: parameterId}).$promise.then(function(parameter) {
                $scope.parametersList[parameterName] = parameter.values;
            });
        };

        $scope.search = function(sale, adr, typeObj, typeSale, countRooms) {
            $scope.searchPar.sale = sale;
            $scope.searchPar.adr = adr;
            $scope.searchPar.typeObj = typeObj;
            $scope.searchPar.typeSale = typeSale;
            $scope.searchPar.countRoomsId = countRooms;
            console.log($scope.searchPar);
            $scope.search2($scope.searchPar);
        };

        $scope.search2 = function(searchPar) {
            var doc = document.getElementById('notFound');
            var doc2 = document.getElementsByClassName('sort')[0];

            $http({
                url: '/search',
                method: "POST",
                data: searchPar
            })
                .then(function (res) {
                    $scope.result = res.data;

                    console.log(res.data);
                    //$scope.result.sort((a, b) => a.id - b.id);
                    $scope.result.sort((a, b) => a.cost - b.cost);

//                    $scope.result.sort((a, b) => Number(a.cost.replace(/ /g, '')) - Number(b.cost.replace(/ /g, '')));
                    console.log(Date.parse($scope.result[3].createdAt));


                    console.log('SearchResult: ', $scope.result);
                    doc.innerText = '';
                    doc2.innerHTML = '<span>Sort by...</span>';
                }, function (err) { // bulletins not found
                    $scope.result = null;
                    doc.innerText = 'Объявлений не найдено';
                    doc2.innerText = '';
                })
        };

        $scope.sortByCost = function(obj, a, b) {
            obj.sort((a, b) => a.cost - b.cost);
        };

        $scope.sortByDate = function(obj, a, b) {
            console.log(Date(obj.createdAt));
            Date.parse(obj.createdAt)
            //obj.sort((a, b) => a.)
        };

        $scope.search2($state.params);
    }]);