'use strict';
const mongoose = require('mongoose');

function createDuration(start, end) {
    return end - start;
}

const ClipSchema = mongoose.Schema({
    input: String,
    // Dont really know what to do with start/endTime since Date seems
    // pretty messy 
    startTime: Number,
    endTime: Number,
    duration: {
        type: Number,
        set: createDuration //pass in start and end when adding a new clip
    },
    
    // Encoding
    vcodec: String,
    acodec: String,
    crf: String,
    output: String
});

module.exports = mongoose.model('Clip', ClipSchema)