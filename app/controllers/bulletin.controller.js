var _ = require('lodash');
var Object = require('../models').object;
var PhotoObject = require('../models').photoObject;
var ParametersObject = require('../models').parametersObject;
var ParametersValue = require('../models').parametersValue;

module.exports = function(sequelize) {
    return {
        saveBulletin: function (req, res) {
            Object.create({
                description: req.body.newObj.comment,
                countRooms: req.body.newObj.countRooms,
                mainArea: req.body.newObj.mainArea,
                kitchenArea: req.body.newObj.kitchenArea,
                liveArea: req.body.newObj.liveArea,
                floor: req.body.newObj.floor,
                adr: req.body.newObj.adr,
                sale: req.body.newObj.sale,
                cost: req.body.newObj.cost,
                penthouse: req.body.newObj.penthouse,
                appartament: req.body.newObj.appartament,
                balcony: req.body.newObj.balcony,
                yearBuild: req.body.newObj.yearBuild,
                userId: req.session.passport.user.idUser,
                typeId: req.body.newObj.typeId
            })
            .then(function (object) {
                res.status(200).json('Объявлено создано успешно');
                console.log(object);
                console.log('Объявление создано успешно_1')
                req.body.newObj.photos.forEach(function(photo) {
                    PhotoObject.create({
                        objectId: object.id,
                        photoId: photo
                    })
                });

                if(req.body.newObj.comfortItems) {
                    req.body.newObj.comfortItems.forEach(function (comfort) {
                        ParametersValue.findOne({where: {id: comfort}})
                            .then(function (par) {
                                ParametersObject.create({
                                    objectId: object.id,
                                    parameterId: par.parameterId,
                                    parameterValueId: comfort
                                })
                            })
                    });
                }

                var parArr = ['clothet', 'parking', 'state', 'typeSale', 'countRooms'];

                parArr.forEach(function (parName) {
                    if (req.body.newObj[parName])
                        ParametersValue.findOne({where:{id: req.body.newObj[parName]}})
                            .then(function (par) {
                                ParametersObject.create({
                                    objectId: object.id,
                                    parameterId: par.parameterId,
                                    parameterValueId: req.body.newObj[parName]
                                });
                            });
                })
            })
            .catch (function (err) {
                console.log('Ошибка добавления объявления', err);
                res.status(500).json('Ошибка создания объявления');
            });
        }
    }
};