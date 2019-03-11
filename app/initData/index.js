var _ = require('lodash');
var async = require('async');

module.exports = function(onSuccessAll) {
    var self = this;

    var tables = [
        'parameters',
        'parametersValue',
        'types'
    ];

    async.eachSeries(tables, function (item, callback) {
        require('./' + item + '.js')(callback);
    }, onSuccessAll);
};