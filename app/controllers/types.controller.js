var _ = require('lodash');
var Types = require('../models').type;

module.exports = function(sequelize) {
    return {
        getTypes: function(req, res) {
            Types.findAll().then(function (types, err) {
                res.status(200).json(types);
            });
        },
        showTypes: function(req, res) {
        },
        createTypes: function(req, res) {
        },
        updateTypes: function(req, res) {
        },
        deleteTypes: function(req, res) {
        }
    }
};