module.exports = function(server){
    server.get('/cache', function(req, res){
        cache.getClipCache()
            .then(function(clipsArr){
                res.send(clipsArr)
            })
            .catch(function(err){
                log.error(err.stack);
                res.sendStatus(500);
                res.end();
            })
    });

    server.post('/cache', function(req, res){
        var video = {
            filedir 	: req.body.video.file.inputFileDirectory,
            filename 	: req.body.video.file.inputFile,
            startTime 	: req.body.video.file.ssString,
            endTime   	: req.body.video.file.endString,
            tournament 	: req.body.video.file.tournamentName,
            round 		: req.body.video.file.round,
            player1 	: req.body.video.file.player1,
            player2		: req.body.video.file.player2,
            output		: req.body.video.file.outputFileName
        };

        cache.cacheClipInfo(video);
    });
}