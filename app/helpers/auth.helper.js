/**
 * Created by Lavrentev on 14.03.2017.
 */
var _ = require('lodash');
var md5 = require('md5');

module.exports = {
    checkPassword: function(login, password, callback) {
        var User = require('../models').user;
        
        User.findOne({where: {login: login, password: md5(password) }})
            .then(function(user) {
                callback(user);
            });
    },

    registerUser: function(req, res) {
        var User = require('../models').user;
        console.log(req.body.username, req.body.password);
        User.findOne({where: {login: req.body.username}})
            .then(function(user) {
                if (user)
                    console.log("Пользователь существует");
                else if (!user) {
                    console.log("Пользователь НЕ существует");
                    User.create({login: req.body.username, password: md5(req.body.password)});
                    res.redirect('/');
                }
            });
    }
}