'use strict';

let _   = require('lodash');
let yt  = require('./youtube');

class UploadManager{
    static init(){
        UploadManager.queue = [];
    }

    addToQueue(id, youtube, uploadReq){
        this.id = id;
        this.youtube = youtube;
        this.uploadReq = uploadReq;
        let u = new Upload(id, youtube, uploadReq);
        UploadManager.queue.push(u);
    }

    getStatus(id){
        var vid = _.findWhere(UploadManager.queue, {id: id});

    }
}

class Upload{
    constructor(id, youtube, uploadReq){
        this.id = id;
        this.youtube = youtube;
        this.uploadReq = uploadReq
    }
}