'use strict';

let prettyBytes     = require('pretty-bytes')
let youtube         = require('youtube-api');
let opn             = require('opn');
let fs              = require('fs');
let log             = require('winston');

class Youtube{
    static init(){
        Youtube.CREDENTIALS = require('./youtube-credentials');
        Youtube.oauth = null;
        Youtube.code  = null;
        Youtube.token = null;

        Youtube.sendOAuth();
    }

    constructor(file, p1name, p2name, tournament, round, bracket){
        this.file = file;
        this.p1name = p1name;
        this.p2name = p2name;
        this.tournament = tournament;
        this.round = round;
        this.bracket = bracket;

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

        let fileLog = {
            level: 'debug',
            filename: './uploadLogs/' + details.title + new Date(),
            handleExceptions: true, //bool
            json: false,  //bool
            colorize: true //bool
        };
        log.add(log.transports.File, fileLog);

        let thisYT =  this;
        try {
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
                    body: fs.createReadStream(this.file)
                }
            }, (err, data) => {
                if (err) {
                    log.error(err.stack);
                }

                log.info("Done.");
                process.exit();
            });

            setInterval(function () {
                try {
                    log.info(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded. File: ` + thisYT.file);
                }catch(err){
                    log.error(err.stack);
                    console.error(err.message);
                }
            }, 250);
        }catch(err){
            log.error(err.stack);
            console.error(err.message);
        }
    }

    createVideoDetails(){
        let title = this.tournament + ' - ' + this.round + ' - ' + this.p1name + ' vs ' + this.p2name;
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
            description: description,
            tags: tags
        };

        return deets;
    }
}

module.exports = Youtube;