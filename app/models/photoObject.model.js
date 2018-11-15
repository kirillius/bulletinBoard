var Sequelize = require("sequelize");

module.exports = function (sequelize, options, callback) {
    var PhotoObject = sequelize.define('photoObject', {
        }
    );

    options.models.object.belongsToMany(options.models.photo, {
        as: 'object',
        through: PhotoObject,
        foreignKey: 'objectId'
    });

    options.models.photo.belongsToMany(options.models.object, {
        as: 'photos',
        through: PhotoObject,
        foreignKey: 'photoId'
    });

    PhotoObject.sync(options).then(function () {
        console.log('Success table photoObject');
        callback();
    });

    return PhotoObject;
};