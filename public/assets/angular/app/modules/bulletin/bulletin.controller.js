angular.module('app.bulletin')
    .controller('BulletinController', ['$scope', '$state', '$http', 'AppPaths', 'rest', 'ParametersByName', 'Parameters', function($scope, $state, $http, AppPaths, rest, ParametersByName, Parameters) {

        $scope.bulletin = {
            sale: 1
        };
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

        $scope.getComfortItems = function() {
            Parameters.get({id: $scope.ParametersByName.comfort.id}).$promise.then(function(parameter) {
                $scope.parametersList.comfort = parameter.values;
            });
        };
        $scope.getComfortItems();

        $scope.nextStep = function() {
            console.log($scope.bulletin);
        }

        $scope.choiceCheckboxComfort = function(itemId, value) {
            if(!$scope.bulletin.comfortItems)
                $scope.bulletin.comfortItems = [];

            if(value) {
                if (!_.find($scope.bulletin.comfortItems, function (item) {
                    return item === itemId;
                })) {
                    $scope.bulletin.comfortItems.push(itemId);
                }
            }
            else
                _.remove($scope.bulletin.comfortItems, function(item) {
                    return item===itemId;
                });
        }
    }]);