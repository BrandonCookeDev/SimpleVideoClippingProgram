var path    = require('path');
var dataDir = path.join(__dirname, 'data');

exports.testPostData = {
    file:{
        id: '',
        inputFile : '',
        inputFileName: 'testVideo.mp4',
        inputFileDirectory: dataDir,
        ss : {
            Hour : 0,
            Minute : 0,
            Second : 4
        },
        ssString : '00:00:04',
        end : {
            Hour : 0,
            Minute : 0,
            Second : 20
        },
        endString : '00:00:20',
        tournamentName: 'testTourney1',
        round : 'Grand Finals',
        player1 : {
            smashtag: 'Troy',
            character: 'Sheik',
            color: 'Green'
        },
        player2 : {
            smashtag: 'StackDolla$',
            character: 'Captain Falcon',
            color: 'Neutral'
        },
        yesAudio : true,
        noAudio : false,
        outputFileName : 'clip.mp4',
        outputFileDirectory: dataDir,
        bracketUrl: 'http://smash.gg/nacldecember/events',
        fileSize:'',
        bytesUploaded:'',
        percentUploaded:0
    }
};