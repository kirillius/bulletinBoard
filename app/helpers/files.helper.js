var _ = require('lodash');
var async = require('async');
var path = require('path');
var fs = require('fs');

module.exports = {
    /*upload: function(req, res) {
        console.log(req.file);
        var Photos = require('../models').photo;
        Photos.create({name: req.file.filename, path: req.file.path})
        .then(function(photo) {
            console.log(photo.id);
        });
        res.json({test: 'someTestMessage', photoId: photo.id});
    }*/

    upload: function(req, res) {

        //var tempPath = process.env.FILES_PATH + slash + 'temp';
        //var pathToFolderEntity = process.env.FILES_PATH + slash + req.body.id.toString();
        var response = {};

        //if (!fs.existsSync(pathToFolderEntity))
            //fs.mkdirSync(pathToFolderEntity);

        async.eachOfSeries(req.files, function (fileObject, index, eachCallback) {
            var Photos = require('../models').photo;
            var newFile = {
                name: fileObject.filename,
                fullPath: 'uploads/' + fileObject.filename,
                //path: pathToFolderEntity,
                //ownerId: req.body.id
            };

            Photos.create({name: fileObject.filename, path: fileObject.path})
                .then(function(photo) {
                    newFile.id = photo.id;
                    addFileToResponse(newFile);
                    eachCallback();
                });

            function fileErrorResponse(error) {
                console.log('fileErrorResponse', error);
                eachCallback(error);
            }
        }, function () {
            response.id = req.body.id;
            res.status(200).json(response);
        });

        function addFileToResponse(file) {
            if(!response.files)
                response.files = [];

            //file.fullPath = file.path+'/'+file.name;
            response.files.push(file);
        }
    },

    delete: function(req,res) {
        console.log('deleting...', req.body);
        var Photos = require('../models').photo;
        Photos.destroy({where: {id: req.body.photo.id}});
        fs.unlink('public/' + req.body.photo.url, err => {
            if (err) return console.log(err);
            console.log('deleting was succesful');
        });
        //Photos.destroy({where: {id: req.body.id}});
        //Photos.destroy({where: {id: {$in: req.body.photos.id}}});
    }
}