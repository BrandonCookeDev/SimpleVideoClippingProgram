'use strict';

let chai = require('chai');
let cap  = require('chai-as-promised');
chai.use(cap);
let assert = chai.assert;
let expect = chai.expect;

let FileSystem = require('../fileSystem');
let data       = require('./data/data');

let FS1, FS2;

describe('FileSystem Test', function(){

    before(function(){
        FS1 = new FileSystem(data.data.directories.directory1);
        FS2 = new FileSystem(data.data.directories.directory2);
    });

    it('should correctly resolve the directory names', function(done){
        try {
            expect(FS1.resolve(data.data.files.file1)).to.be.equal(data.expected.resolved.resolved1);
            expect(FS2.resolve(data.data.files.file2)).to.be.equal(data.expected.resolved.resolved2);
            done();
        }catch(err){
            done(err)
        }
    });

    it('should correctly get the file size 1', function(){
        return expect(FS1.getFileSize(data.data.files.file1)).to.eventually.equal(data.expected.files.file1.size);
    });

    it('should correctly get the file size 2', function(){
        return expect(FS2.getFileSize(data.data.files.file2)).to.eventually.equal(data.expected.files.file2.size)
    });



});