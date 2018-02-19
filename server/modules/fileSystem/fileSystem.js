'use strict';

let fs = require('fs');
let path = require('path');

let CLIENT_PATH = path.join(__dirname, '..', 'client');

class FileSystem{

    static async listFiles(req, res){
        let body = req.body;
        let path = body.path;


    }

}

module.exports = FileSystem;