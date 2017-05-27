'use strict';

let fs    = require('fs');
let path  = require('path');
let log   = require('winston');
let wreck = require('wreck');
let request = require('request');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

let chai = require('chai');
let cap  = require('chai-as-promised');
chai.use(cap);
let assert = chai.assert;

let ClipQueue = require('../ClipQueue');
let testData = require('./data/data');
let port = testData.port;

describe('clip module int test', function() {

    before(function () {
        ClipQueue.init();

        var express = require('express');
        var bodyParser = require('body-parser');
        var app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        require('../endpoints')(app);

        app.listen(port, function (err) {
            if (err) {
                log.error(err);
                process.exit(1337);
            }
            log.info('server running on ' + port);
        });
    });

    afterEach(function(done){
        log.info('searching for clip file');
        var output = path.join(testData.testPostData.video.file.outputFileDirectory,
                               testData.testPostData.video.file.outputFileName);
        fs.stat(output, function(err, stats){
            if(err){
                log.warn('nothing found');
                log.error(err);
                return;
            }

            log.info('deleting file');

            fs.unlink(output, function(err){
                if(err){
                    log.error(err);
                    process.exit(2);
                }
                done();
            })
        })
    });

    it('should create a clip correctly', function (done) {
        let url = 'http://localhost:'+ port +'/createClip';

        wreck.post(url, { payload: testData.testPostData }, function(err, res, data){
            if(err){
                log.error(err);
                return assert.fail(err);
            }

            var created = false;
            assert.isOk(res.headers.location);
            var statusUrl = 'http://localhost:' + port + res.headers.location;

            var status = setInterval(function(){
                wreck.get(statusUrl, function(err, res, data){
                    if(err){
                        clearInterval(status);
                        log.error(err);
                        return assert.fail(err);
                    }

                    var isComplete = decoder.write(data);
                    if(isComplete == 'false')
                        log.info('creating...');
                    else{
                        clearInterval(status);

                        var outputFile = path.join(testData.testPostData.video.file.outputFileDirectory,
                                                   testData.testPostData.video.file.outputFileName);
                        fs.stat(outputFile, function(err, stats){
                            if(err){
                                log.error(err);
                                return assert.fail(err);
                            }

                            assert.isOk(stats);
                            assert.isOk(stats.isFile());
                            assert.isOk(stats.size > 0);
                            done();
                        })
                    }
                })
            }, 2000);

        })

    })

});