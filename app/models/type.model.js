var Sequelize = require("sequelize");

module.exports = function (sequelize, options, callback) {
    var Types = sequelize.define('type', {
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

    Types.sync(options).then(function () {
        console.log('Success table types');
        callback();
    });

    return Types;
};