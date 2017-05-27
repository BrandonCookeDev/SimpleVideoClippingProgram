var Clip        = require('./Clip');
var ClipQueue   = require('./ClipQueue');
var Player      = require('./Player');
var Match       = require('./Match');

ClipQueue.init();

module.exports = function(server){

    server.post('/createClip', function(req, res) {
        var filedir = req.body.video.file.inputFileDirectory;
        var filename = req.body.video.file.inputFile;
        var outputDir = req.body.video.file.outputFileDir;
        var outputFile = req.body.video.file.outputFileName;
        var inFilepath = path.join(filedir, filename);
        var outFilepath = path.join(outputDir, outputFile);

        var startTime = req.body.video.file.ssString;
        var endTime = req.body.video.file.endString;

        var tournament = req.body.video.file.tournamentName;
        var round = req.body.video.file.round;
        var player1 = req.body.video.file.player1;
        var player2 = req.body.video.file.player2;

        var Player1 = new Player(player1.smashtag, player1.character, player1.color);
        var Player2 = new Player(player2.smashtag, player2.character, player2.color);
        var Match   = new Match(tournament, round);
        var clip    = new Clip(inFilepath, startTime, endTime, outFilepath);

        var cmd      = clip.createFfmpegCommand();
        var killsig  = ClipQueue.createKillsignalNumber();
        var options  = {
            killSignal: killsig
        };

        var proc = exec(cmd, options, function (err, stdout, stderr) {
            ClipQueue.removeFromQueue(queueItem.id);

            if (err) {
                log.error(err.stack);
            }
            else {
                log.info('complete: ' + cmd);
                log.info(stdout);
            }
        });

        proc.on('close', (code, signal) => {
            console.log(
                `child process terminated due to receipt of signal ${signal}`);
        });

        var queueItem = ClipQueue.addToQueue(clip, killsig, proc);

        res.header('Location', '/clipCreationStatus?id=' + id);
        res.status(202);
        res.end();
    });

    server.get('/clipCreationStatus', function(req, res){
        var id = req.query.id;
        var isQueued = _.findIndex(clipCreationQueue, function(video)
            {return video.id == id}) >= 0; //IS IN THE QUEUE THEN IT IS NOT COMPLETE
        var isComplete = !isQueued;
        res.send(isComplete);
    });

    server.post('/killClip', function(req, res){
        var id   = req.query.id;
        var item = ClipQueue.getItemFromQueue(id);

        if(!item)
            res.status(500).send('no clip in queue');
        else {
            item.process.kill(item.killSignal);
            res.sendStatus(200);
        }
    })
};