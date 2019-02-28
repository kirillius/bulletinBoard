var _ = require('lodash');
var Parameters = require('../models').parameters;
var ParametersValue = require('../models').parametersValue;

module.exports = function(sequelize) {
    return {
        getParameters: function(req, res) {
            Parameters.findAll({
                include: [
                    {
                        model: ParametersValue,
                        as: 'values',
                        foreignKey: 'parameterId'
                    }
                ]
            }).then(function (parameters, err) {
                res.status(200).json(parameters);
            });
        },
        showParameters: function(req, res) {
            Parameters.findOne({
                where: {id: req.params.id},
                include: [{
                    model: ParametersValue,
                    as: 'values',
                    foreignKey: 'parameterId'
                }]
            })
                .then(function (parameter, err) {
                    res.status(200).json(parameter);
                });
        },
        createParameters: function(req, res) {
            Parameters.create({
                insert: {id: req.params.id},
                include: [{
                    model: ParametersValue,
                    as: 'values',
                    foreignKey: 'parameterId'
                }]
            })
                .then(function (parameter, err) {
                   res.status(200).json(parameter);
                });
        },
        updateParameters: function(req, res) {
        },
        deleteParameters: function(req, res) {
        }
    }
};