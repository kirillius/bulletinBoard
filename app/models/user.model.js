var Sequelize = require("sequelize");

module.exports = function (sequelize, options, callback) {
    var Users = sequelize.define('user', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            fio: {
                type: Sequelize.STRING
            },
            login: {
                type: Sequelize.STRING
            }
        }
    );

    Users.sync(options).then(function () {
        console.log('Success table users');
        callback();
    });

    return Users;
};