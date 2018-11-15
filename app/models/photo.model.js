var Sequelize = require("sequelize");

module.exports = function (sequelize, options, callback) {
    var Photo = sequelize.define('photo', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING
            },
            path: {
                type: Sequelize.STRING
            }
        }
    );

    Photo.sync(options).then(function () {
        console.log('Success table photo');
        callback();
    });

    return Photo;
};