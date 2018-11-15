var Sequelize = require("sequelize");

module.exports = function (sequelize, options, callback) {
    var Streets = sequelize.define('street', {
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

    Streets.sync(options).then(function () {
        console.log('Success table streets');
        callback();
    });

    return Streets;
};