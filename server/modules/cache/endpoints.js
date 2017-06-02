const log   = require('winston');
const cache = require('./cache').instance;

module.exports = function(server){
    server.get('/cache', function(req, res){
        cache.getTotalClipCache()
            .then(function(clipsArr){
                res.send(clipsArr || [])
            })
            .catch(function(err){
                log.error(err.stack);
                res.sendStatus(500);
                res.end();
            })
    });

    server.post('/cache', function(req, res){
        var video = req.body.video;
        var file = video.file;
        var tournament = file.tournamentName;
        var round = file.round;
        var p1tag = file.player1.smashtag;
        var p2tag = file.player2.smashtag;

        cache.cacheClipInfo(video, tournament, round, p1tag, p2tag)
            .then(function(success){
                if(success) res.sendStatus(200);
                else res.sendStatus(500);
            })
            .catch(function(err){
                if(err){
                    log.error(err);
                    return res.status(500).send(err);
                }
                return res.sendStatus(500);
            })
    });
};