var Sequelize = require("sequelize");

module.exports = function (sequelize, options, callback) {
    var Objects = sequelize.define('object', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            description: {
                type: Sequelize.TEXT
            },
            countRooms: {
                type: Sequelize.INTEGER
            },
            area: {
                type: Sequelize.FLOAT
            },
            kitchenArea: {
                type: Sequelize.FLOAT
            },
            floor: {
                type: Sequelize.INTEGER
            }
        }
    );

    options.models.user.hasMany(Objects, {as: 'objectsUser', foreignKey : 'userId', onDelete: 'SET NULL'});
    Objects.belongsTo(options.models.user, {as: 'user', foreignKey : 'userId'});

    Objects.belongsTo(options.models.street, {as: 'street', foreignKey : 'streetId'});
    Objects.belongsTo(options.models.type, {as: 'type', foreignKey : 'typeId'});

    Objects.sync(options).then(function () {
        console.log('Success table objects');
        callback();
    });

    return Objects;
};