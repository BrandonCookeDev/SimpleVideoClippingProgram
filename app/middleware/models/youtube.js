'use strict';
const mongoose = require("mongoose");
const _ = require('lodash');

function generateId(tournament, round, p1, p2) {
    return _.join([tournament, round, p1, p2], "::");    
}

const YoutubeSchema = mongoose.Schema({
    file: String,
    p1Sponsor: String,
    p1Name: String,
    p2Sponsor: String,
    p2Name: String,
    tournament: String,
    round: String, //Could be number
    bracket: String,
    id: {
        type: String,
        set: generateId
    },
    fileSize: {
        type: Number
        // Probably will need a method to set it based on the file
    },
    bytesUploaded: {
        type: Number,
        default: 0
    },
    uploadedTF: {
        type: Boolean,
        default: false
    },
    oauth: String //Didn't really know what to declare this
    
});

module.exports = mongoose.model('Youtube', YoutubeSchema);