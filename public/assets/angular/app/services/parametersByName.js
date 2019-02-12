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