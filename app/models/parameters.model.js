var Sequelize = require("sequelize");

module.exports = function (sequelize, options, callback) {
    var Parameters = sequelize.define('parameters', {
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

    Parameters.sync(options).then(function () {
        console.log('Success table parameters');
        callback();
    });

    return Parameters;
};