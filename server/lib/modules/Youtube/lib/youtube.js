var log         = require('winston');
var youtubeApi  = require('youtube-api');

class Youtube{

    constructor(key, secret, file){
        this.key = key;
        this.secret = secret;
        this.file = file;
    }

    upload(){

    }

}

module.exports = Youtube;