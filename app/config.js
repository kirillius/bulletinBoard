var _ = require('lodash');

module.exports = {
    'general': {
        database: {
            user: 'kirillius',
            name: 'bulletinBoardDB'
        }
    },
    'production': {
    },
    'test': {
        database: {
            user: 'rental',
            password: 'kirillius1991',
            server: '185.158.153.107'
        }
    },
    'development': {
        database: {
            user: 'Art',
            password: '1234a',
            server: 'localhost'
        }
    },
    'getCurrentConfig': function(app){
        var defaultEnvironment = 'development';

        if(!app)
            app = {};
        return _.merge({}, this.general, this[app.get('env') || defaultEnvironment]);
    }
};