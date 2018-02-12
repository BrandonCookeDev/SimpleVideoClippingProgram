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
var hostname = 'http://localhost:' + port;

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
        try {
            fs.stat(output, function (err, stats) {
                if(err && err.message.indexOf('ENOENT: no such file'))
                    return log.warn('File doesn\'t exist');
                else if(err)
                    return log.error(err);


                log.info('deleting file');
                fs.unlinkSync(output);
                done();
            })
        } catch(err){
            if(err) {
                log.error(err);
                process.exit(1);
            }
        }
    });

    it('should create a clip correctly', function (done) {
        let url = hostname + '/createClip';

        wreck.post(url, { payload: testData.testPostData }, function(err, res, data){
            if(err){
                log.error(err);
                return assert.fail(err);
            }

            var created = false;
            assert.isOk(res.headers.location);
            var statusUrl = hostname + res.headers.location;

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

    });

    /** this doesn't work yet **/
    xit('should kill the clip via killsignal', function(done){
        let url = hostname + '/createClip';

        wreck.post(url, { payload: testData.testPostData }, function(err, res, data) {
            if (err) {
                log.error(err);
                return assert.fail(err);
            }

            var id = res.headers.queueid;
            var killUrl = hostname + '/killClip?id='+id;
            wreck.get(killUrl, function(err, res){
                if (err) {
                    log.error(err);
                    return assert.fail(err);
                }


                assert.equals(res.status, 200);
                assert.equals(ClipQueue.queue.length, 0);
            })

        })
    })

});