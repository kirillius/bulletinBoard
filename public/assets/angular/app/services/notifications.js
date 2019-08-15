angular
    .module('app')
    .service('notifications', ['toastr', 'toastrConfig', function (toastr, toastrConfig) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-top-right'
        });

        var service = {
            success: function(text) {
                toastr.success(text);
            },
            error: function(text) {
                toastr.error(text);
            },
            warning: function(text) {
                toastr.warning(text);
            }
        };

        return service;
    }]);