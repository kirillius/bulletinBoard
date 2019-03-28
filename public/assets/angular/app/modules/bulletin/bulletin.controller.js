angular.module('app.bulletin')
    .controller('BulletinController', ['$scope', '$state', '$http', 'AppPaths', 'rest', 'ParametersByName', 'Parameters', 'Upload', '$timeout', function($scope, $state, $http, AppPaths, rest, ParametersByName, Parameters, Upload, $timeout) {

        $scope.bulletin = {
            sale: 0
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
            localStorage.setItem('userBulletin', JSON.stringify($scope.bulletin));
            $state.go('app.bulletinStep2');
        };

        $scope.saveBulletin = function() {
            var newObj = JSON.parse(localStorage.getItem('userBulletin'));
            var photoIdObj = [];

            for (var num in $scope.photos)
                photoIdObj.push($scope.photos[num].id);

            newObj['oomment'] = $scope.bulletin.comment;
            newObj['photos'] = photoIdObj;

            localStorage.setItem('userBulletin', JSON.stringify(newObj));
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
        };

        $scope.maxFiles = 7;

/*        $scope.uploadFiles = function(files, errFiles) {
            $scope.files = files;
            $scope.errFiles = errFiles;
            angular.forEach(files, function(file) {
                file.upload = Upload.upload({
                    url: 'upload',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            });
        };*/

        $scope.fileAdded = function (files) {
            // на случай ложных срабатываний (таковые бывают) проверяем не пустой ли file
            $scope.files = files;
            $scope.photos = [];

            if (files && files.length) {
                $scope.uploadFile = true;
                var data = {
                    id: $scope.bulletin.idObject
                };

                data['files'] = files;

                Upload.upload({
                    url: '/upload',
                    arrayKey: '',
                    data: data
                })
                    .then(function (response) {
                        if (response.data.id) {
                            console.log(response.data.id);
                            $scope.photos.idObject = response.data.id;
                        }

                        if (response.data.files && response.data.files.length) {
                            _.forEach(response.data.files, function(file) {
                                var objPhoto = {
                                    id : file.id,
                                    url : file.fullPath,
                                    thumbUrl : file.fullPath,
                                    deletable : true
                                }
                                $scope.photos.push(objPhoto);
                            });
                        }
                        console.log($scope.photos);
                        $scope.uploadFile = false;
                    });
            }
        };

    }]);