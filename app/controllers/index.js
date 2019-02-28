module.exports = function(sequelize) {
    var controllers = [
        'types', 'parameters', 'users'
    ];

    var result = {};
    controllers.forEach(function (controllerName) {
        result[controllerName] = require('./' + controllerName + '.controller')(sequelize);
    });

    return result;
};