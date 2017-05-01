var log = require('winston');

class VideoFile{

    constructor(filepath, data){
        this.filepath = filepath;
        this.data = data;
    }
}

module.exports = VideoFile;