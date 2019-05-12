var _ = require('lodash');
var multer = require('multer');

module.exports = function(app, passport){

    var controllers = require('./controllers')();
    var helpers = require('./helpers');

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

    var upload = multer({ //multer settings
        storage: storage
    }).array('files', 7);

    //Auth logic
    /*app.get("/ntlm-auth", passport.authenticate('passport-windowsauth'), function(req, res) {
        res.redirect('/');
    });
    app.get("/auth", passport.authenticate('passport-windowsauth'), controllers.auth.currentUser);
    app.get("/api/current_user", controllers.auth.currentUser);*/

    //Define all routes
    defineRestResource('types');
    defineRestResource('parameters');

    app.post('/login', passport.authenticate('local', {failureRedirect: '/loginfail'}), function(req, res) {
        res.redirect('/');
    });

    app.post('/register', helpers.auth.registerUser);

    app.get('/logout', helpers.auth.logOut);

    app.post('/upload', upload, helpers.files.upload);

    app.post('/delete', helpers.files.delete);

    app.post('/saveBulletin', controllers.bulletin.saveBulletin);

    app.post('/search', helpers.search.searchStreet);

    app.post('/getObjects', helpers.main.getCountObjects);

    app.post('/roomCountId', helpers.search.findRoomCountId);

    app.get("/*", helpers.common.generateMainPage);

    function defineRestResource(modelName){
        var UpperFirstName = _.upperFirst(modelName);

        var controller = controllers[modelName];

        // в REST-запросы добавлена дополнительная итерация: helpers.logs.responseAndAddLog(modelName, 'create')
        // для логирования действий над узлами дерева и их параметрами
        //helpers.auth.checkAuth,
        app.get("/api/" + modelName, controller['get' + UpperFirstName]);
        app.get("/api/" + modelName + "/:id", controller['show' + UpperFirstName]);

        if(controller['create' + UpperFirstName])
            app.post("/api/" + modelName, controller['create' + UpperFirstName]);

        if(controller['update' + UpperFirstName])
            app.put("/api/" + modelName + "/:id", controller['update' + UpperFirstName]);

        if(controller['delete' + UpperFirstName])
            app.delete("/api/" + modelName + "/:id", controller['delete' + UpperFirstName]);

        console.log('rest routes for resource ' + modelName + ' is defined');
    }
};