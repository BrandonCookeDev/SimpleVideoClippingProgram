'use strict';

let log = require('winston');
let AWS = require('aws-sdk');
let S3  = new AWS.S3();

class s3{
    constructor(bucket){
        this.bucket = bucket;
    }

    getBucketContents(){
        let thisS3 = this;
        return new Promise(function(resolve, reject){
            S3.listBuckets({
                Bucket: thisS3.bucket
            }, function(err, results){

            })
        })
    }

    getFile(key){
        let thisS3 = this;
        return new Promise(function(resolve, reject){
            S3.getObject({
                Bucket: thisS3.bucket,
                Key: key
            }, function(err, file){

            })
        })
    }
}