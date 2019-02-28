var _ = require('lodash');

module.exports = function(app, passport){

    var controllers = require('./controllers')();
    var helpers = require('./helpers');

    //Auth logic
    /*app.get("/ntlm-auth", passport.authenticate('passport-windowsauth'), function(req, res) {
        res.redirect('/');
    });
    app.get("/auth", passport.authenticate('passport-windowsauth'), controllers.auth.currentUser);
    app.get("/api/current_user", controllers.auth.currentUser);*/

    //Define all routes
    defineRestResource('types');
    defineRestResource('parameters');

    //app.get("/*", helpers.auth.checkAuth, helpers.common.generateMainPage);
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

        app.post('/login', passport.authenticate('local', {failureRedirect: '/loginfail'}), function(req, res) {
            res.redirect('/');
        });

        app.post('/register', helpers.auth.registerUser);

        console.log('rest routes for resource ' + modelName + ' is defined');
    }
};