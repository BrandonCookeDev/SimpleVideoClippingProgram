const _    = require('lodash');
const path = require('path');


exports.testPostData = {
    video: {
        file: {
            id: '',
            inputFileName: 'testVideo.mp4',
            inputFileDirectory: __dirname,
            start: {
                timeStr: "00:00:04",
                time: {
                    Hour: 0,
                    Minute: 0,
                    Second: 4
                }
            },
            end: {
                timeStr: "00:00:59",
                time: {
                    Hour: 0,
                    Minute: 0,
                    Second: 59
                }
            },
            tournamentName: 'testTourney1',
            round: 'Grand Finals',
            player1: {
                smashtag: 'Troy',
                character: 'Sheik',
                color: 'Green'
            },
            player2: {
                smashtag: 'StackDolla$',
                character: 'Captain Falcon',
                color: 'Neutral'
            },
            yesAudio: true,
            noAudio: false,
            outputFileName: 'clip.mp4',
            outputFileDirectory: __dirname,
            bracketUrl: 'http://smash.gg/nacldecember/events',
            fileSize: '',
            bytesUploaded: '',
            percentUploaded: 0
        }
    }
};

exports.port = 5000;