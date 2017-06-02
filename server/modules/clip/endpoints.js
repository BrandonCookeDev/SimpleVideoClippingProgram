const DIR         = __dirname;

const _           = require('lodash');
const log         = require('winston');
const path        = require('path');
const express     = require('express');
const router      = express.Router();
const exec        = require('child_process').exec;

const Clip        = require('./Clip');
const ClipQueue   = require('./ClipQueue');
const Player      = require('./Player');
const Match       = require('./Match');

router.route('/createClip').post(function(req, res) {
    try {
        var filedir = path.join(DIR, '..'+path.sep+'..'+path.sep+'..', 'client', 'videos'); //req.body.video.file.inputFileDirectory;
        var filename = req.body.video.file.inputFileName;
        var outputDir = req.body.video.file.outputFileDirectory;
        var outputFile = req.body.video.file.outputFileName;
        var inFilepath = path.join(filedir, filename);
        var outFilepath = path.join(outputDir, outputFile);

        var startTime = req.body.video.file.start.timeStr;
        var endTime = req.body.video.file.end.timeStr;

        var tournament = req.body.video.file.tournamentName;
        var round = req.body.video.file.round;
        var player1 = req.body.video.file.player1;
        var player2 = req.body.video.file.player2;

        var Player1 = new Player(player1.smashtag, player1.character, player1.color);
        var Player2 = new Player(player2.smashtag, player2.character, player2.color);
        var match = new Match(tournament, round);
        var clip = new Clip(inFilepath, startTime, endTime, outFilepath);

        var cmd = clip.createFfmpegCommand();
        var killsig = ClipQueue.createKillsignalNumber();
        var options = {
            killSignal: killsig
        };

        log.info('running cmd process');
        log.debug(cmd);

        var proc = exec(cmd, options, function (err, stdout, stderr) {
            ClipQueue.removeFromQueue(queueItem.id);

            if (err) {
                log.error(err.stack);
            }
            else {
                log.info('complete: ' + queueItem.clip.input);
                log.info(stdout);
            }
        });

        proc.on('close', (code, signal) => {
            console.warn(
                `child process terminated due to receipt of signal ${signal}, code: ${code}`);
        });

        var queueItem = ClipQueue.addToQueue(clip, killsig, proc);

        res.header('Location', '/clipCreationStatus?id=' + queueItem.id);
        res.header('queueId', queueItem.id);
        res.status(202);
        res.end();
    }catch(err){
        if(err){
            log.error(err);
            res.sendStatus(500);
        }
        res.status(500).send('unknown error');
    }
});

router.route('/clipCreationStatus').get( function(req, res){
    try {
        var id = req.query.id;
        //var isQueued = _.findIndex(ClipQueue.queue, function (video) {
        //        return video.id == id
        //    }) >= 0; //IS IN THE QUEUE THEN IT IS NOT COMPLETE
        var isQueued = ClipQueue.getItemFromQueue(id);
        var isComplete = !isQueued;
        res.send(isComplete);
    }catch(err){
        if(err){
            log.error(err);
            return res.sendStatus(500)
        }
        res.status(500).send('unknown error');
    }
});

router.route('/killClip').get(function(req, res){
    try {
        var id = req.query.id;
        var item = ClipQueue.getItemFromQueue(id);

        if (!item)
            res.status(500).send('no clip in queue');
        else {
            item.process.kill(item.killSignal);
            res.sendStatus(200);
        }
    }catch(err){
        if(err){
            log.error(err);
            return res.sendStatus(500)
        }
        res.status(500).send('unknown error');
    }
});

module.exports = function(server){
    server.use(router);
};