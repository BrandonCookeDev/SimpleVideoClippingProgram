var log         = require('winston');
var youtube     = require('./youtube');
var youtubeApi  = require('youtube-api');

class YoutubeController{

    /**
     * This function uploads a file to Youtube
     *
     * @param req
     * @param res
     */
    static upload(req, res){

    }

    /**
     * This function initiates the OAuth process
     *
     * @param req
     * @param res
     * @constructor
     */
    static AuthYoutube(req, res){

    }

    /**
     * This function catches the OAuth from Youtube
     *
     * @param req
     * @param res
     * @constructor
     */
    static VerifyYoutube(req, res){

    }
}

module.exports = YoutubeController;