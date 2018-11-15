// Входная точка backend приложения
var express = require("express"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    methodOverride = require("method-override"),
    request = require("request"),
    session = require("express-session"),
    Sequelize = require("sequelize");

var app = express();
var config = require('./app/config').getCurrentConfig(app);

app.locals.root_dir = __dirname ;
app.locals.app_dir = __dirname + '/app';
app.locals.public_dir = __dirname + '/public';

// Указание на frontend папку как публичную, подключение вспомогательных модулей в express.js
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());

app.use(session({
    secret: 'G598tjpa5IqzzBy6ZFti',
    resave: true,
    saveUninitialized: true
}));

// Старт express.js приложения, установка на определенный порт
var server = app.listen(process.env.PORT || 2300, function () {
    var port = server.address().port;
    console.log("App now running on port " + port);
});

var sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
    host: config.database.server,
    dialect: 'mssql',

    pool: {
        max: 100,
        min: 0,
        idle: 20000,
        acquire: 120000
    },
    dialectOptions:{
        "port": 1433
    }
});

sequelize
    .authenticate()
    .then(function(err) {
        console.log('DB success connection');
        // force true for recreate database tables
        require('./app/models').init(sequelize, {force: false}, function(){
            console.log('Models created success, created init data');
            require('./app/routes')(app);
            /*require('./app/initData/index')(function() {
                console.log('All init data created');
                require('./app/routes')(app, sequelize, passport);
            });*/
        });
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err);
});

module.exports = app;
