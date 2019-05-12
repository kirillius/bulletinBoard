var _ = require('lodash');
var async = require('async');
var ParametersValue = require('../models').parametersValue;
var ParametersObject = require('../models').parametersObject;
var Object = require('../models').object;
var Type = require('../models').type;

module.exports = {
    getCountObjects: function (req, res) {

        var roomNames = [
            {nameVar: 'oneRooms', nameStr: '1'},
            {nameVar: 'twoRooms', nameStr: '2'},
            {nameVar: 'threeRooms', nameStr: '3'},
            {nameVar: 'studioRooms', nameStr: 'Студия'}
        ];

        var objCount = {
            purchase: {
                oneRooms: {name: '1', count: 0},
                twoRooms: {name: '2', count: 0},
                threeRooms: {name: '3', count: 0},
                studioRooms: {name: 'Студия', count: 0},
                apartRooms: {name: 'Комнаты в квартире', count: 0}
            },
            rent: {
                oneRooms: {name: '1', count: 0},
                twoRooms: {name: '2', count: 0},
                threeRooms: {name: '3', count: 0},
                studioRooms: {name: 'Студия', count: 0},
                apartRooms: {name: 'Комнаты в квартире', count: 0}
            }
        };

        function getObjByName(roomName, roomVar, callback) { // поиск объекта по названию количества комнат
            ParametersValue.findOne({where: {name: roomName}})
                .then(function (value) {
                    ParametersObject.findAll({where: {parameterValueId: value.id}})
                        .then(function (objPars) { // считаем количество объектов по количеству комнат
                            async.each(objPars, function (objPar, eachcallback) {
                                Object.findOne({where: {id: objPar.objectId}})
                                    .then(function (obj) {
                                        if (obj.sale) objCount.rent[roomVar].count++;
                                        else objCount.purchase[roomVar].count++;
                                        eachcallback();
                                    });
                            }, function () {
                                callback();
                            })
                        });
                });
        }

        function getApartRooms(callback) {
            Type.findOne({where: {name: 'Комната'}})
                .then(function (el) {
                    Object.findAll({where: {typeId: el.id}})
                        .then(function (objects) { // считаем количество объектов-"комнат в квартире"
                            async.each(objects, function (obj, eachcallback) {
                                if (obj.sale) objCount.rent['apartRooms'].count++;
                                else objCount.purchase['apartRooms'].count++;
                                eachcallback();
                            }, function () {
                                callback();
                            });
                        })
                })
        }

        function countAll() {
            getApartRooms(function () {
                async.each(roomNames, function (el, eachcallback) {
                    getObjByName(el.nameStr, el.nameVar, function () {
                        eachcallback();
                    });
                }, function () {
                    res.status(200).json(objCount);
                });
            });
        }

        countAll();
    }
};

