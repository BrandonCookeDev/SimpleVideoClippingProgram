'use strict';

let co   = require('co');
let fs   = require('fs');
let path = require('path');

class FileSystem{
    constructor(directory){
        if(!directory)
            directory = __dirname;
        else if(!path.isAbsolute(directory))
            directory = path.resolve(directory);
        this.directory = directory;
    }

    resolve(file){
        if(file.indexOf(this.directory) < 0)
            return path.join(this.directory, file);
        else return file;
    }

    list(){
        var This = this;
        return new Promise(function(resolve, reject){
            fs.readdir(This.directory, function (err, items) {
                if (err) {
                    return reject(err)
                }
                return resolve(items);
            })
        });
    }

    getStats(file){
        var This = this;
        return new Promise(function(resolve, reject) {
            let filepath = This.resolve(file);
            fs.open(filepath, 'r', function(err, fd){
                if(err)
                    return reject(err);

                fs.fstat(fd, function(err, stats){
                    if(err)
                        return reject(err);
                    return resolve(stats);
                })
            })

        })
    }

    getFileSize(file){
        var This = this;
        return new Promise(function(resolve, reject){
            co(function*(){
                let filepath = This.resolve(file);
                let stats = yield This.getStats(filepath);
                return resolve(stats.size);
            }).catch(reject);
        })
    }
}


module.exports = FileSystem;