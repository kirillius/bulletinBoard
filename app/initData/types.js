var Types = require('../models').type;
var async = require('async');
var _ = require('lodash');

var basicParameters = [
    {
        name: 'Квартира'
    },
    {
        name: 'Квартира в новостройке'
    },
    {
        name: 'Комната'
    },
    {
        name: 'Дом'
    },
    {
        name: 'Коттедж'
    },
    {
        name: 'Дача'
    },
    {
        name: 'Таунхаус'
    },
    {
        name: 'Участок земли'
    }
];

var fields = ['name'];

module.exports = function(onSuccessAll) {
    Types.findAll().then(function(data) {
        if(data && data.length)
            return onSuccessAll();

        async.eachSeries(basicParameters, function (item, callback) {
            Types.create(_.pick(item, fields)).then(function() {callback();});
        }, onSuccessAll);
    });
};