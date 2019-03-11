var Parameters = require('../models').parameters;
var async = require('async');
var _ = require('lodash');

var basicParameters = [
    {
        name: 'typeSale',
        displayName: 'Тип продажи'
    },
    {
        name: 'countRooms',
        displayName: 'Число комнат'
    },
    {
        name: 'clothet',
        displayName: 'Санузел'
    },
    {
        name: 'state',
        displayName: 'Состояние'
    },
    {
        name: 'parking',
        displayName: 'Парковка'
    },
    {
        name: 'comfort',
        displayName: 'Комфорт'
    }
];

var fields = ['name', 'displayName'];

module.exports = function(onSuccessAll) {
    Parameters.findAll().then(function(data) {
        if(data && data.length)
            return onSuccessAll();

        async.eachSeries(basicParameters, function (item, callback) {
            Parameters.create(_.pick(item, fields)).then(function() {callback();});
        }, onSuccessAll);
    });
};