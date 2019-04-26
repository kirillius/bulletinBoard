var _ = require('lodash');
var async = require('async');
var sequelize = require('sequelize');
var Op = sequelize.Op;
var Object = require('../models').object;
var PhotoObject = require('../models').photoObject;
var Photo = require('../models').photo;
var Types = require('../models').type;
var ParametersObject = require('../models').parametersObject;
var Parameters = require('../models').parameters;

module.exports = {
    searchStreet: function(req, res) {
        console.log(req.body);
        var searchPar = {};
        var searchResult = [];
        if (req.body.typeObj) searchPar.typeObj = req.body.typeObj; else searchPar.typeObj = '%'; // тип объекта
        if (req.body.sale === 0) searchPar.sale = req.body.sale; else if (req.body.sale === 1) searchPar.sale = req.body.sale; else searchPar.sale = '%'; // продать / сдать в аренду
        //  if (req.body.countRooms) searchPar.countRooms = req.body.countRooms; else searchPar.countRooms = '%'; // количество комнат
        //  if (req.body.typeSale) searchPar.typeSale = req.body.typeSale; else searchPar.typeSale = '%'; // тип продажи
        if (req.body.adr) searchPar.adr = '%' + req.body.adr + '%'; else searchPar.adr = '%'; // адрес



        Object.findAll({where: {adr: {[Op.like]: searchPar.adr}, typeId: {[Op.like]: searchPar.typeObj}, sale: {[Op.like]: searchPar.sale}/*, countRooms: {[Op.like]: searchPar.countRooms}*/ }})
            .then(function (bulletins) {
                if (bulletins.length > 0) {

                    async.each(bulletins, function (bulletin, eachCallback) {
                        findCountRooms(bulletin.id, function (cb) {
                            if (req.body.countRooms) {
                                if (req.body.countRooms === cb) searchResult.push(bulletin.dataValues);
                            } else {
                                searchResult.push(bulletin.dataValues);
                            }
                            eachCallback();
                        })
                    }, function (done) {
                        if (searchResult.length > 0) {
                            async.each(searchResult, function (bulletin, eachCallback) {
                                bulletin.cost = String(bulletin.cost).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

                                findTypeObject(bulletin.typeId, function (callback) {
                                    bulletin.typeObj = callback;
                                });
                                findPhoto(bulletin.id, function (callback) {
                                    bulletin.photo = callback;
                                    eachCallback();
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
            })

        var findPhoto = function (id, callback) {
            PhotoObject.findOne({where: {objectId: id}})
                .then(function (photoObjId) {
                    Photo.findOne({where: {id: photoObjId.photoId}})
                        .then(function (photo) {
                            callback(photo.path);
                        })
                })
        };

        var findTypeObject = function (id, callback) {
            Types.findOne({where: {id: id}})
                .then(function (type) {
                    callback(type.name);
                })
        }

        var findCountRooms = function (id, callback) {
            Parameters.findOne({where: {name: 'countRooms'}})
                .then(function (countRoom) {
                    ParametersObject.findOne({where: {objectId: id, parameterId: countRoom.id}})
                        .then(function (result) {
                            callback(result.parameterValueId);
                        })
                })
        }
    }
}