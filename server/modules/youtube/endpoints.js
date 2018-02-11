'use strict';

let log     = require('winston');
let Youtube = require('./youtube');

module.exports = function(server){
    server.get('/youtube/auth', function(req, res){
        Youtube.oauth();
    });

    server.get('/youtube/authenticate', function(req, res){
        var code = req.query.code;
        var verify = Youtube.verifyOAuth(code);
    });

    server.get('/uploadStatus', function(req, res){
        var id = req.query.id;
        var uploadStatus = Youtube.getUploadStatus(id);

        if(uploadStatus == true)
            res.status(200).send('UPLOADED');
        else res.send(uploadStatus);
    });

    server.post('/upload', function(req, res){
        var file = req.body.file;

        var input 		= file.inputFileName;
        var tournament  = file.tournamentName;
        var round 		= file.round;
		var p1sponsor	= file.player1.sponsor;
        var p1name 		= file.player1.smashtag;
		var p2sponsor	= file.player2.sponsor;
        var p2name 		= file.player2.smashtag;
        var output 		= file.outputFileName;
        var bracket 	= file.bracketUrl;
        var description = file.videoDescription;

        var yt = new Youtube(output, p1sponsor, p1name, p2sponsor, p2name, tournament, round, description, bracket);

        if(!Youtube.isAuthenticated())
            res.sendStatus(500);
        else{
            yt.upload()
                .then(function(){
                    var statusUrl = '/uploadStatus?id='+yt.id;
                    res.header('Location', statusUrl);
                    res.status(202);
                    res.end();
                })
                .catch(function(err){
                    log.error(err);
                    if(err.message.indexOf('No access or refresh token is set.') >= 0)
                        return res.status(404);
                    return res.sendStatus(500);
                })
        }
    });

    server.get('/oauthUrl', function(req, res){
        console.log('hit /oauthUrl endpoint');
        try{
            res.status(200).send(Youtube.getOauthUrl());
        }
        catch(e){
            res.status(500).send(e);
        }
    })
}