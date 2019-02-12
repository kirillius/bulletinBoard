module.exports = function(sequelize) {
    var controllers = [
        'types', 'parameters'
    ];

    var result = {};
    controllers.forEach(function (controllerName) {
        result[controllerName] = require('./' + controllerName + '.controller')(sequelize);
    });

    return result;
};