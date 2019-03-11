var Parameters = require('../models').parameters;
var ParametersValue = require('../models').parametersValue;
var async = require('async');
var _ = require('lodash');

var values = [
    {
        parameter: 'typeSale',
        names: [
            'Не выбрано',
            'Альтернатива',
            'Свободная продажа']
    },
    {
        parameter: 'countRooms',
        names: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10 и более',
            'Студия']
    },
    {
        parameter: 'clothet',
        names: [
            'Не выбрано',
            'Совмещённый',
            'Раздельный',
            '2 и более']
    },
    {
        parameter: 'state',
        names: [
            'Не выбрано',
            'Евроремонт',
            'Дизайнерский ремонт',
            'Без отделки',
            'Требует ремонта',
            'Не требует ремонта',
            'Первичная отделка',
            'С отделкой',
            'Хороший',
            'Частичный',
            'Черновая отделка']
    },
    {
        parameter: 'parking',
        names: [
            'Не выбрано',
            'Нет парковки',
            'Подземная парковка',
            'Охраняемая парковка',
            'Отдельная парковка',
            'Парковка рядом']
    },
    {
        parameter: 'comfort',
        names: [
            'Стеклопакет',
            'Кондиционер',
            'Водонагреватель',
            'Телефон',
            'Интернет',
            'Холодильник',
            'Стиральная машина',
            'Посудомоечная машина',
            'Телевизор',
            'Мебель в комнатах',
            'Мебель на кухне'
        ]
    }
];

var parametersValueFields = ['name', 'parameterId'];

module.exports = function(onSuccessAll) {
    ParametersValue.findAll().then(function(data) {
        if(data && data.length)
            return onSuccessAll();

        async.eachSeries(values, eachName, onSuccessAll);

        function eachName(item, callbackParameters) {
            Parameters.findAll({
                where: {name: item.parameter}
            }).then(function(data) {
                if (!data || !data.length)
                    return callbackParameters();

                async.eachSeries(item.names, function (itemName, callback) {
                    var obj = {
                        parameterId: data[0].id,
                        name: itemName
                    };

                    ParametersValue.create(_.pick(obj, parametersValueFields)).then(function () {
                        callback();
                    });
                }, callbackParameters);
            });
        }
    });
};