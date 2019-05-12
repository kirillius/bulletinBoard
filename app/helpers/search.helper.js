var _ = require('lodash');
var async = require('async');
var sequelize = require('sequelize');
var Op = sequelize.Op;
var Object = require('../models').object;
var PhotoObject = require('../models').photoObject;
var Photo = require('../models').photo;
var Types = require('../models').type;
var ParametersObject = require('../models').parametersObject;
var ParametersValue = require('../models').parametersValue;
var Parameters = require('../models').parameters;

module.exports = {
    searchStreet: function(req, res) {
        var searchPar = {};
        var searchResult = [];

        if (req.body.typeObj) searchPar.typeObj = req.body.typeObj; else searchPar.typeObj = '%'; // тип объекта
        if (req.body.sale === 0) searchPar.sale = req.body.sale; else if (req.body.sale === 1) searchPar.sale = req.body.sale; else searchPar.sale = '%'; // продать / сдать в аренду
        if (req.body.adr) searchPar.adr = '%' + req.body.adr + '%'; else searchPar.adr = '%'; // адрес

        Object.findAll({where: {adr: {[Op.like]: searchPar.adr}, typeId: {[Op.like]: searchPar.typeObj}, sale: {[Op.like]: searchPar.sale} }})
            .then(function (bulletins) {
                if (bulletins.length > 0) {
                    async.each(bulletins, function (bulletin, eachCallback) {
                        findTypeSaleByObjectId(bulletin.id, function (callback) {
                            if ((req.body.typeSale === callback) || (!req.body.typeSale)) {
                                findCountRooms(bulletin.id, function (cb) {
                                    if ((req.body.countRoomsId === cb) || (!req.body.countRoomsId)) {
                                        searchResult.push(bulletin.dataValues);
                                        eachCallback();
                                    } else eachCallback();
                                })
                            } else eachCallback();
                        })
                    }, function (done) {
                        if (searchResult.length > 0) {
                            async.each(searchResult, function (bulletin, eachCallback) {
                                bulletin.cost = String(bulletin.cost).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

                                findTypeObject(bulletin.typeId, function (callback) {
                                    bulletin.typeObj = callback;
                                    findPhoto(bulletin.id, function (callback) {
                                        bulletin.photo = callback;
                                        eachCallback();
                                    });
                                });

                            }, function (err) {
                                res.status(200).json(searchResult);
                            })
                        } else {
                        res.status(500).send('Объявлений не найдено');
                        }
                    });
                } else {
                    res.status(500).send('Объявлений не найдено');
                }
            });

        var findPhoto = function (id, callback) {
            PhotoObject.findOne({where: {objectId: id}})
                .then(function (photoObjId) {
                    if (photoObjId) {
                        Photo.findOne({where: {id: photoObjId.photoId}})
                            .then(function (photo) {
                                if (photo) callback(photo.path);
                                else callback(null);
                            })
                    } else callback(null);
                })
        };

        var findTypeObject = function (id, callback) {
            Types.findOne({where: {id: id}})
                .then(function (type) {
                    if (type) callback(type.name);
                    else callback(null);
                })
        };

        var findTypeSaleByObjectId = function (id, callback) {
            findParameterId('Тип продажи', function (cb) {
                ParametersObject.findOne({where: {objectId: id, parameterId: cb}})
                    .then (function (parVal) {
                        if (parVal) callback(parVal.parameterValueId);
                        else callback(null);
                    })
            })
        };

        var findParameterId = function (displayName, callback) {
            Parameters.findOne({where: {displayName: displayName}})
                .then (function (par) {
                    callback(par.id);
                })
        };

        var findCountRooms = function (id, callback) {
            findParameterId('Число комнат', function (cb) {
                ParametersObject.findOne({where: {objectId: id, parameterId: cb}})
                    .then(function (result) {
                        if (result) callback(result.parameterValueId);
                        else callback(null);
                    })
            })
        };
    },

    findRoomCountId: function (req, res) {
        if (req.body.countRooms === 'Комната') {
            Types.findOne({where: {name: req.body.countRooms}})
                .then (function (type) {
                    res.status(200).json({typeObj: type.id});
                })
        } else {
            Parameters.findOne({where: {displayName: 'Число комнат'}})
                .then (function (par) {
                    ParametersValue.findOne({where: {parameterId: 2, name: req.body.countRooms}})
                        .then (function (parVal) {
                            res.status(200).json({countRoomsId: parVal.id});
                        })
                });
        }
    }
};