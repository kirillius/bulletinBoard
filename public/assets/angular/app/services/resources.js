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