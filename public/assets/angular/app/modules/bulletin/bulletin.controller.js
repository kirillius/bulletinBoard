angular.module('app.bulletin')
    .controller('BulletinController', ['$scope', '$state', '$http', '$timeout', 'AppPaths', 'rest', 'ParametersByName', 'Parameters', 'Upload', 'notifications', function($scope, $state, $http, $timeout, AppPaths, rest, ParametersByName, Parameters, Upload, notifications) {

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
            var additionalVar = true;
            if ($scope.bulletin.sale == 0) delete $scope.bulletin.paymentFrequency;
            else additionalVar = $scope.bulletin.paymentFrequency;
            console.log($scope.bulletin);
            localStorage.setItem('userBulletin', JSON.stringify($scope.bulletin));
            if ($scope.bulletin.adr && $scope.bulletin.typeId && $scope.bulletin.cost && $scope.bulletin.countRooms && additionalVar)
                $state.go('app.bulletinStep2');
            else notifications.warning("Попытка перехода к следующей странице с незаполненными полями");
        };

        $scope.saveBulletin = function() {
            var newObj = JSON.parse(localStorage.getItem('userBulletin'));
            var photoIdObj = [];

            for (var num in $scope.photos)
                photoIdObj.push($scope.photos[num].id);

            newObj['name'] = $scope.bulletin.name;
            newObj['phone'] = $scope.bulletin.phone;
            newObj['comment'] = $scope.bulletin.comment;
            newObj['photos'] = photoIdObj;

            localStorage.setItem('userBulletin', JSON.stringify(newObj));

            $http({
                url: '/saveBulletin',
                method: "POST",
                data: {newObj}
            })
                .then(function (response) {
                    console.log(response);
                    $state.go('app.mainPage');
                    notifications.success('Объявление успешно добавлено');
                }, function (response) {
                    console.log('err', response)
                    $state.go('app.bulletin');
                    notifications.error('Объявление не может быть добавлено');
                })
        };

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
        $scope.photos = [];

        $scope.fileAdded = function (files) {
            // на случай ложных срабатываний (таковые бывают) проверяем не пустой ли file

            $scope.files = files;

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
                                if ($scope.photos.length >= $scope.maxFiles) return;
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

        // Gallery methods gateway
        $scope.methods = {};
        $scope.openGallery = function(){
            $scope.methods.open();
        };

        $scope.delete = function(img, cb){
            $http({
                url: '/delete',
                method: "POST",
                data: {'photo': img}
            });
            cb();
        };

        $scope.symbolAppend = function(id, num) {
            // позорная функция присоединение звёздочки к элементу с указанным id
            if ((!document.getElementById('spanAppended_' + num) && document.getElementById(id))) { // one-time-binding не очень работает
                var span = document.createElement('span');
                span.classList.add('symbol-required');
                span.id = 'spanAppended_' + num;
                span.innerText = '*';
                document.getElementById(id).children[0].appendChild(span);
                span.style.marginLeft = parseInt(window.getComputedStyle(span).marginLeft) + 4 + 'px';
            }
            return null; // return для one-time-binding
        };
    }]);