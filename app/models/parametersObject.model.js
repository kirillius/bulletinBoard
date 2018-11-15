var Sequelize = require("sequelize");

module.exports = function (sequelize, options, callback) {
    var ParametersObject = sequelize.define('parametersObject', {
            objectId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            parameterId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            parameterValueId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            }
        }
    );

    ParametersObject.belongsTo(options.models.object, {as: 'object', foreignKey : 'objectId'});
    ParametersObject.belongsTo(options.models.parameters, {as: 'parameter', foreignKey : 'parameterId'});
    ParametersObject.belongsTo(options.models.parametersValue, {as: 'parameterValue', foreignKey : 'parameterValueId'});

    /*options.models.object.belongsToMany(options.models.parameters, {
        as: 'objectForParameter',
        through: ParametersObject,
        foreignKey: 'objectId'
    });

    options.models.parameters.belongsToMany(options.models.object, {
        as: 'parametersForObject',
        through: ParametersObject,
        foreignKey: 'parameterId'
    });*/

    ParametersObject.sync(options).then(function () {
        console.log('Success table parametersObject');
        callback();
    });

    return ParametersObject;
};