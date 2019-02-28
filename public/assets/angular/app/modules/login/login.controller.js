angular.module('app.login')
    .controller('LoginController', ['$scope', '$http', function($scope, $http) {
        $scope.userData = {
            login: '',
            password: ''
        };

        $scope.userLogin = function(login, password) {
            $http.post('/login', userData = {username: login, password: password});
        };

        $scope.userRegister = function(login, password) {
            console.log(login, password);

            $http.post('/register', userData = {username: login, password: password});
        }
     }]);