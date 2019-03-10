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
        console.log('Логин: \"' + req.body.username + '\" Пароль: \"' + req.body.password + '\ Пароль_2: \"' + req.body.repassword + '\"');
        if (req.body.username.length < 3) {
            console.log('Логин должен содержать не менее 3-ёх символов');
        }
        else if (req.body.username.includes(' ')) console.log('Логин не может содержать пробелы');
        else if (req.body.password != req.body.repassword) console.log('Пароли не совпадают');
        else {
            if (req.body.password.length < 3) {
                console.log('Пароль должен содержать не менее 3-ёх символов');
            }
            else {
                User.findOne({where: {login: req.body.username}})
                .then(function(user) {
                    if (user) {
                        console.log("Пользователь существует");
                        //res.setHeader('Error', 'User already exists');
                        //res.json({message: 'something interesting'});
                        res.sendfile('./public/register.html');
                    }
                    else if (!user) {
                        console.log("Пользователь НЕ существует");
                        User.create({fio: req.body.fio, login: req.body.username, password: md5(req.body.password)});
                        res.redirect('/');
                    }
                });
            }
        }
    },

    checkOut: function(req, res) {
        console.log(req.cookies);
        if (req.isAuthenticated()) {
        /*if (req.session.passport) {*/
            console.log('вход выпонлен');
        }
        else
            res.redirect('/');
            console.log('вход НЕ выполнен');
    },

    logOut: function(req, res) {
        req.logout();
        res.redirect('/');
    },
}