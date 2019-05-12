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
            $scope.search2($scope.searchPar);
        };

        $scope.search2 = function(searchPar) {
            var doc = document.getElementById('notFound');

            $http({
                url: '/search',
                method: "POST",
                data: searchPar
            })
                .then(function (res) {
                    $scope.result = res.data;
                    doc.innerText = '';
                }, function (err) { // bulletins not found
                    $scope.result = null;
                    doc.innerText = 'Объявлений не найдено';
                })
        };

        $scope.search2($state.params);
    }]);