'use strict';

let path = require('path');
let FileSystem = require('./fileSystem');

module.exports = function(server) {

    let videoDirpath = path.join(__dirname, '..', '..', '..', 'client', 'videos');
    let videoFS = new FileSystem(videoDirpath);

    let serverDirpath = path.join(__dirname, '..', '..', '..');
    let serverFS = new FileSystem(serverDirpath);

    server.get('/listVideoDirectory', function(req, res) {
        try{
            videoFS.list()
                .then(items => {
                    res.status(200).send(items);
                })
                .catch(err => {
                    if(err)
                        return res.status(500).send(err);
                    return res.sendStatus(500)
                })
        }catch(err){
            if(err)
                return res.status(500).send(err);
            return res.sendStatus(500)
        }
    });

    server.post('/fileSize', function(req, res){
        let file = req.body.file;
        try{
            serverFS.getFileSize(file)
                .then(size => {
                    res.status(200).send(size);
                })
                .catch(err => {
                    if(err)
                        return res.status(500).send(err);
                    return res.sendStatus(500)
                })
        }catch(err){
            if(err)
                return res.status(500).send(err);
            return res.sendStatus(500)
        }
    })

};