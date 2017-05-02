'use strict';

let youtube         = require('youtube-api');
let opn             = require('opn');
let fs              = require('fs');
let log             = require('winston');

class Youtube{
    static init(){
        Youtube.CREDENTIALS = require('./youtube-credentials');
    }

    constructor(file){
        this.file = file;

        this.oauth = null;
        this.code  = null;
        this.token = null;
    }

    sendOAuth(){
        this.oauth = youtube.authenticate({
            type: "oauth"
            , client_id: Youtube.CREDENTIALS.web.client_id
            , client_secret: Youtube.CREDENTIALS.web.client_secret
            , redirect_url: Youtube.CREDENTIALS.web.redirect_uris[0]
        });

        opn(this.oauth.generateAuthUrl({
            access_type: "offline"
            , scope: ["https://www.googleapis.com/auth/youtube.upload"]
        }));
    }

    veryfyOAuth(code){
        this.code = code;

        log.info("Trying to get the token using the following code: " + this.code);
        this.oauth.getToken(code, (err, tokens) => {

            if (err) {
                log.error(err.stack);
                return new Error(err.message);
            }

            log.info("Got the tokens.");
            this.oauth.setCredentials(tokens);
            this.upload();
        });
    }

    upload(){
        log.info("The video is being uploaded. Check out the logs in the terminal.");
        let req = youtube.videos.insert({
            resource: {
                // Video title and description
                snippet: {
                    title: "Testing YoutTube API NodeJS module"
                    , description: "Test video upload via YouTube API"
                }
                // I don't want to spam my subscribers
                , status: {
                    privacyStatus: "private"
                }
            }
            // This is for the callback function
            , part: "snippet,status"

            // Create the readable stream to upload the video
            , media: {
                body: fs.createReadStream(this.file)
            }
        }, (err, data) => {
            if(err){
                log.error(err.stack);
            }

            log.info("Done.");
            process.exit();
        });

        setInterval(function () {
            log.info(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded. File: ` + this.file);
        }, 250);
    }
}

module.exports = Youtube;