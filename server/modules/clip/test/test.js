'use strict';

let fs    = require('fs');
let path  = require('path');
let log   = require('winston');
let wreck = require('wreck');

let chai = require('chai');
let cap  = require('chai-as-promised');
chai.use(cap);
let assert = chai.assert;

let testData = require('./data/data');

describe('clip module int test', function(){

    it('should create a clip correctly', function(done){
        let url = '/createClip';
        wreck.post(url, testData.testPostData, function(err, res, data){
            if(err){
                log.error(err);
                return assert.fail(err);
            }

            var done = false;
            var statusUrl = res.headers('location');

            var status = setInterval(function(){
                wreck.get(statusUrl, function(err, res, data){
                    if(err){
                        log.error(err);
                        return assert.fail(err);
                    }

                    var isComplete = data;
                    if(!isComplete)
                        log.info('creating...');
                    else{
                        clearInterval(status);

                        var outputFile = path.join(testData.testPostData.file.outputFileDirectory,
                                                   testData.testPostData.file.outputFileName);
                        fs.stat(outputFile, function(err, stats){
                            if(err){
                                log.error(err);
                                return assert.fail(err);
                            }

                            assert.isOk(stats);
                            assert.isOk(stats.isFile());
                            assert.isOk(stats.size > 0);
                        })
                    }
                })
            }, 2000);

        })
        
    })

});