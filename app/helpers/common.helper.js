var _ = require('lodash');
var async = require('async');

module.exports = {
    prepareResponse: function(res){
        return function(result) {
            res.status(200).json(result);
        }
    },
    errorResponse: function (res) {
        return function(error) {
            console.log("err: ");
            console.log(error);
            res.status(500).json(error);
        }
    },
    generateMainPage : function(req, res) {
        res.sendfile('./public/main.html');
    }
};