var _ = require('lodash');
var async = require('async');

module.exports = {
    init: function(sequelize, options, onSuccessAll){
        var self = this;

        var models = [
            'user',
            'street',
            'type',
            'object',
            'photo',
            'photoObject',
            'parameters',
            'parametersValue',
            'parametersObject'
        ];

        options = options || {};
        options.models = {};

        async.eachSeries(models, function (modelName, callback) {
            self[modelName] = options.models[modelName] = require('./' + modelName + '.model.js')(sequelize, options, callback);
        }, onSuccessAll);
    }
};