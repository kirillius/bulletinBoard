angular
    .module('app')
    .service('notifications', ['toastr', 'toastrConfig', function (toastr, toastrConfig) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-top-right'
        });

        var service = {
            success: function() {
                toastr.success('Объявление успешно добавлено');

            },
            error: function() {
                toastr.error('Объявление не может быть добавлено');
            }
        };

        return service;
    }]);