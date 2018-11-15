var Sequelize = require("sequelize");

module.exports = function (sequelize, options, callback) {
    var ParametersValue = sequelize.define('parametersValue', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING
            }
        }
    );

    options.models.parameters.hasMany(ParametersValue, {as: 'parameters', foreignKey : 'parameterId', onDelete: 'SET NULL'});
    ParametersValue.belongsTo(options.models.parameters, {as: 'value', foreignKey : 'parameterId'});

    ParametersValue.sync(options).then(function () {
        console.log('Success table parametersValue');
        callback();
    });

    return ParametersValue;
};