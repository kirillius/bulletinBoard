angular
    .module('app', [
        'ui.router',
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ngMessages',
        'ui.bootstrap',
        'ui.select',
        'app.general',
        'app.main',
        'app.bulletin',
        'ngFileUpload',
        'thatisuday.ng-image-gallery',
        'toastr'
    ])
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider', 'AppPaths',
        function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, AppPaths) {

            $stateProvider
                .state('app', {
                    url: '/',
                    controller: 'AppController as app',
                    templateUrl: AppPaths.app + 'templates/index.html',
                    abstract: true
                });

            $urlRouterProvider.otherwise('/');

        }])
    .run(['$rootScope', function($rootScope){
    }]);
angular
    .module('app.bulletin', [
        'ui.router',
        'app.general'
    ]);

    angular
    .module('app.general', [
    ]);
angular
    .module('app.main', [
        'ui.router',
        'app.general'
    ]);
angular.module('app')
    .controller('AppController', ['$scope', '$rootScope', '$state', '$http', 'AppPaths', function($scope, $rootScope, $state, $http, AppPaths) {
        var self = this;
    }]);
angular
    .module('app')
    .service('ParametersByName', ['Parameters', function(Parameters){
        let self = this;

        let parametersLoaded = false;
        let promise;

        self.reload = function() {
            let parametersFromStorage = localStorage.getItem('parametersByName');

            if (parametersFromStorage) {
                let parsedParameters = JSON.parse(parametersFromStorage);
                if (_.isObject(parsedParameters))
                    _.extend(self, parsedParameters);

                parametersLoaded = true;
            }

            promise = Parameters.query({}).$promise.then(function (parameters) {

                let parametersByName = {};
                _.forEach(parameters, function (parameter) {
                    parametersByName[parameter.name] = parameter;
                });

                let parametersByNameToStorage = _.cloneDeep(parametersByName);
                _.forEach(parametersByNameToStorage, function (parameter) {
                    delete parameter.values;
                });
                localStorage.setItem('parametersByName', JSON.stringify(parametersByNameToStorage));

                parametersLoaded = true;

                return parametersByName;

                /*return MinenergoClass.query({}).$promise.then(function (minenergoClassValues) {

                    dictionariesByNames['minenergoClass'] = {
                        name: 'minenergoClass',
                        values: _.map(minenergoClassValues, function (val) {
                            return {id: val.id, value: val.name + '(' + val.code + ')'}
                        })
                    };

                    _.extend(self, dictionariesByNames);
                });*/

            });
            return self;
        };

        self.onLoad = function(callback){
            if(parametersLoaded)
                return callback(self);
            else
                promise.then(callback)
        };

        return self.reload();
    }]);
var defaultOptions = {
    'update': { method: 'PUT' }
};

//  simple resources
var resources_names = [
    'parameters'
];

resources_names.forEach(function(resource_name){
    var ResourceName = _.upperFirst(_.camelCase(resource_name));
    angular.module('app').factory(ResourceName, ['$resource', function($resource) {
        return $resource('api/' + resource_name + '/:id', { id: '@id' }, defaultOptions);
    }]);
});
// Сервис для оперативного получения данных с удаленного бэкенда, позволяет избежать дублирования запросов
// и более оперативно получать данные если запрос уже был отправлен
angular
    .module('app')
    .service('rest', ['$http', function($http){

        var service = {
            baseUrl: '/api/',

            ajax: function(method, uri, data){
                var url = this.baseUrl + uri;
                method = method.toUpperCase();

                console.log(method + ' request: "' + url + '":', data);

                var httpConfig = {
                    method: method,
                    url: url,
                    data: data,
                    timeout: 600000
                };

                return $http(httpConfig).then(function(response){
                    console.log(method + ' response: "' + url + '":', response.data);

                    response.alert = {
                        code: response.data.errorCode,
                        type: response.data.errorCode == "200" ? "success" : "danger",
                        text: response.data.errorMessage
                    };
                    return response.data;
                }, function(response){
                    response.alert = {
                        code: response.data.errorCode,
                        type: "danger",
                        text: "Ошибка на сервере. Обратитесь к администратору."
                    };

                    response.data.err = true;
                    return response.data;
                });
            },
            get: function(uri){
                return this.ajax('get', uri);
            },
            post: function(uri, data){
                return this.ajax('post', uri, data);
            },
            put: function(uri, data){
                return this.ajax('put', uri, data);
            },
            delete: function(uri){
                return this.ajax('delete', uri);
            }
        };

        return service;
    }]);
angular.module('app.bulletin')
    .controller('BulletinController', ['$scope', '$state', '$http', '$timeout', 'AppPaths', 'rest', 'ParametersByName', 'Parameters', 'Upload', 'toastr', 'toastrConfig',function($scope, $state, $http, $timeout, AppPaths, rest, ParametersByName, Parameters, Upload, toastr, toastrConfig) {

        $scope.bulletin = {
            sale: 0
        };

        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-right'
        });

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
                    toastr.success('Объявление успешно добавлено');
                }, function (response) {
                    console.log('err', response)
                    $state.go('app.bulletin');
                    toastr.error('Объявление не может быть добавлено');
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
            })
            cb();
        }
    }]);
angular
    .module('app.bulletin')
    .config(['$stateProvider', 'AppPaths', function($stateProvider, AppPaths) {

        $stateProvider
            .state('app.bulletin', {
                url: 'newBulletin',
                controller: 'BulletinController',
                templateUrl: AppPaths.bulletin + 'templates/index.html'
            })
            .state('app.bulletinStep2', {
                url: 'newBulletin2',
                controller: 'BulletinController',
                templateUrl: AppPaths.bulletin + 'templates/step2.html'
            })
            .state('app.mainPage', {
                controller: 'BulletinController',
                templateUrl: AppPaths.main + 'templates/index.html'
            });
    }]);
angular.module('app.main')
    .controller('MainController', ['$scope', '$state', '$http', 'AppPaths', function($scope, $state, $http, AppPaths) {
    }]);
angular
    .module('app.main')
    .config(['$stateProvider', 'AppPaths', function($stateProvider, AppPaths) {

        $stateProvider
            .state('app.main', {
                url: '',
                controller: 'MainController',
                templateUrl: AppPaths.main + 'templates/index.html'
            });
    }]);
var app_path = 'assets/angular/app/',
    modules_path = app_path + 'modules/';

angular.module('app.general')
    .constant('AppPaths', {
        app:            app_path,
        modules:        modules_path,
        main:      modules_path + 'main/',
        bulletin:      modules_path + 'bulletin/',
        login:      modules_path + 'login/'
    });