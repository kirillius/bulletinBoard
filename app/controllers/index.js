module.exports = function(sequelize) {
    var controllers = [
        'types', 'parameters', 'bulletin'
    ];

    var result = {};
    controllers.forEach(function (controllerName) {
        result[controllerName] = require('./' + controllerName + '.controller')(sequelize);
    });

    return result;
};