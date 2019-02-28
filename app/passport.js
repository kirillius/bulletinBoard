/**
 * Created by Lavrentev on 07.12.2016.
 */
module.exports = function(passport) {
    var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            var helpers = require('./helpers');
            /*
    Здесь нужно вызвать auth.helper и проверить логин/пароль юзера*/
            helpers.auth.checkPassword(username, password, function (user) {
                if (user) {
                    return done(null, {
                        username: user.name,
                        idUser: user.id
                    });
                }
                else {
                    return done(null, false, req.flash('authMessage', 'Неверный пароль или Ваша учетная запись не активирована'));
                }
            })
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, {
            idUser: user["idUser"],
            username: user["username"]
        });
    });

    passport.deserializeUser(function (data, done) {
        try {
            done(null, data);
        } catch (e) {
            done(err)
        }
    });
}
