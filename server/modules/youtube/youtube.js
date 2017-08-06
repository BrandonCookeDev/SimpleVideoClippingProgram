'use strict';

let _               = require('lodash');
let prettyBytes     = require('pretty-bytes')
let youtube         = require('youtube-api');
let opn             = require('opn');
let fs              = require('fs');
let log             = require('winston');

let UploadManager   = require('./uploadManager');
let uploadLock = null;

class Youtube{
    static init(){
        Youtube.CREDENTIALS = require('./youtube-credentials');
        Youtube.oauth = null;
        Youtube.code  = null;
        Youtube.token = null;
        Youtube.queue = [];

        //UploadManager.init();

        Youtube.sendOAuth();
    }

    constructor(file, p1sponsor, p1name, p2sponsor, p2name, tournament, round, description, bracket){

        this.file = file;
		this.p1sponsor = p1sponsor;
        this.p1name = p1name;
		this.p2sponsor = p2sponsor;
        this.p2name = p2name;
        this.tournament = tournament;
        this.round = round;
        this.description = description;
        this.bracket = bracket;

        this.id = _.join([tournament, round, p1name, p2name], "::");
        this.bytesUploaded = 0;
        this.oauth = null;
    }

    static isAuthenticated(){
        return !(!Youtube.oauth && !Youtube.code && !Youtube.token);
    }

    static sendOAuth(){
        Youtube.oauth = youtube.authenticate({
            type: "oauth"
            , client_id: Youtube.CREDENTIALS.web.client_id
            , client_secret: Youtube.CREDENTIALS.web.client_secret
            , redirect_url: Youtube.CREDENTIALS.web.redirect_uris[0]
        });

        opn(Youtube.oauth.generateAuthUrl({
            access_type: "offline"
            , scope: ["https://www.googleapis.com/auth/youtube.upload"]
        }));
    }

    static verifyOAuth(code){
        this.code = code;
        let thisYT = this;
        log.info("Trying to get the token using the following code: " + this.code);
        return new Promise(function(resolve, reject){
            thisYT.oauth.getToken(thisYT.code, (err, tokens) => {

                if (err) {
                    log.error(err.stack);
                    return new Error(err.message);
                }

                log.info("Got the tokens.");
                Youtube.oauth.setCredentials(tokens);
                Youtube.token = tokens;
                resolve(tokens)
            });
        });

    }

    upload(){
        log.info("The video is being uploaded. Check out the logs in the terminal.");
        let details = this.createVideoDetails();

        /*
        let fileLog = {
            level: 'debug',
            filename: './uploadLogs/' + details.title + new Date(),
            handleExceptions: true, //bool
            json: false,  //bool
            colorize: false //bool
        };
        log.add(log.transports.File, fileLog);
        log.info('begin');
        */

        let done = false;
        let thisYT =  this;
        return new Promise(function(resolve, reject) {
            try{
                if(thisYT.isInQueue()) {
                    thisYT.addToQueue();
                    let req = youtube.videos.insert({
                        resource: {
                            // Video title and description
                            snippet: {
                                title: details.title,
                                description: details.description,
                                tags: details.tags
                            },
                            // I don't want to spam my subscribers
                            status: {
                                privacyStatus: "public"
                            }
                        },
                        // This is for the callback function
                        part: "snippet,status",

                        // Create the readable stream to upload the video
                        media: {
                            body: fs.createReadStream(thisYT.file)
                        }
                    }, (err, data) => {
                        if (err) {
                            log.error(err.stack);
                            reject(err.message);
                        }

                        clearInterval(logUpload);
                        log.info("Done.");
                        Youtube.queue = _.reject(Youtube.queue, thisYT);
                        resolve();
                    });

                    //TODO put video in UploadManager
                    if(!req){
                        thisYT.removeFromQueue();
                        return reject('Youtube not connected');
                    }

                    var logUpload = setInterval(function () {
                        try {
                            let uploaded = `${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded. File: `;

                            //UPDATE ELEMENT IN THE VIDEO QUEUE WITH NEW BYTES DISPATCHED
                            thisYT.bytesUploaded = prettyBytes(req.req.connection._bytesDispatched);
                            /*
                             _.extend(_.findc(Youtube.queue,
                             function(yt){return yt.id == thisYT.id}), thisYT);
                             */
                            log.info(uploaded + thisYT.file);
                        } catch (err) {
                            log.error(err.stack);
                            thisYT.removeFromQueue();
                            console.error(err.message);
                            return reject(err.message);
                        }
                    }, 250);

                    resolve();
                }
            }catch(err){
                thisYT.removeFromQueue();

                log.error(err.stack);
                console.error(err.message);
                reject(err.message);
            }
        });
    }

    createVideoDetails(){
        
		let p1name = this.p1sponsor ? (this.p1sponsor + ' | ' + this.p1name) : this.p1name;
		let p2name = this.p2sponsor ? (this.p2sponsor + ' | ' + this.p2name) : this.p2name;
	
		let title = this.tournament + ' - ' + p1name + ' vs ' + p2name + ' - ' + this.round;
		

        let description = this.tournament + '! View tournament info and brackets at ' + this.bracket +
            '\n\n' +
            'Watch live and follow us at: \n'  +
            'http://twitch.tv/RecursionGG\n'   +
            'http://twitter.com/RecursionGG\n' +
            'http://facebook.com/RecursionGG\n';
        

        //////////////////////////////////////////
        // TAGS
        let tags =
            'ssbm, super, smash, bros, melee, recursion, recursiongg';
        let p1split = this.p1name.split(' ');
        let p2split = this.p2name.split(' ');
        let roundSplit = this.round.split(' ');
        let tournamentSplit = this.tournament.split(' ');

        p1split.forEach(word => {
            tags += ', ' + word;
        });
        p2split.forEach(word => {
            tags += ', ' + word;
        });
        roundSplit.forEach(word => {
            tags += ', ' + word;
        });
        tournamentSplit.forEach(word => {
            tags += ', ' + word;
        });


        let deets = {
            title: title,
            description: this.description,
            tags: tags.split(',')
        };

        return deets;
    }

    addToQueue(){
        Youtube.queue.push(this);
    }

    removeFromQueue(){
        if(this.isInQueue(this))
            this.queue = _.reject(Youtube.queue,
                {p1name: this.p1name,
                    p2name: this.p2name,
                    round: this.round,
                    tournament: this.tournament,
                    file: this.file})

    }

    isInQueue(){
        return _.findIndex(Youtube.queue,
                {p1name: this.p1name,
                    p2name: this.p2name,
                    round: this.round,
                    tournament: this.tournament,
                    file: this.file}) < 0
    }

    getUploadStatus(){
        let vid = _.find(Youtube.queue,
            function(video){return video.id == this.id});
        return vid.bytesUploaded;
    }

    static addToQueue(youtubeObj){
        Youtube.queue.push(youtubeObj);
    }

    static removeFromQueue(youtubeObj){
        if(this.isInQueue(youtubeObj))
            this.queue = _.reject(Youtube.queue,
                                {p1name: youtubeObj.p1name,
                                 p2name: youtubeObj.p2name,
                                 round: youtubeObj.round,
                                 tournament: youtubeObj.tournament,
                                 file: youtubeObj.file})

    }

    static isInQueue(youtubeObj){
        return _.findIndex(Youtube.queue,
                {p1name: youtubeObj.p1name,
                 p2name: youtubeObj.p2name,
                 round: youtubeObj.round,
                 tournament: youtubeObj.tournament,
                 file: youtubeObj.file}) < 0
    }

    static getUploadStatus(id){
        let vid = _.find(Youtube.queue, function(video){ return video.id == id });

        var data;
        if(vid) {
            data = {
                complete: false,
                bytesUploaded: vid.bytesUploaded
            }
        }
        else{
            data = {
                complete: true,
                bytesUploaded: vid.bytesUploaded
            }
        }
        return data;
    }
}

module.exports = Youtube;