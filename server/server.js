var Youtube	= require('./public/youtube');
var youtube = new Youtube();
Youtube.init();

var fs  	= require('fs');
var path 	= require('path');
var log 	= require('winston');
var ffmpeg 	= require('ffmpeg');
var moment  = require('moment');

var express = require('express');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var clip = require('./public/clip.js');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

var portGl = 1337;
var hostGl = '127.0.0.1';

var app = express();
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(fileUpload());

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.get('/home', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/youtube/auth', function(req, res){
	Youtube.oauth();
});

app.get('/youtube/authenticate', function(req, res){
	var code = req.query.code;
	var verify = Youtube.verifyOAuth(code);
});

app.post('/upload', function(req, res){
	var file = req.body.file;

	var input = file.inputFile;
	var tournament = file.tournamentName;
	var round = file.round;
	var p1name = file.player1;
	var p2name = file.player2;
	var output = file.outputFileName;
	var bracket = file.bracketUrl;

	var yt = new Youtube(output, p1name, p2name, tournament, round, bracket);
	if(!Youtube.isAuthenticated())
		res.sendStatus(500);
	else{
		yt.upload();
        res.sendStatus(200);
	}
});

app.post('/createClip', function(req, res){
	var filedir 	= req.body.video.file.inputFileDirectory;
	var filename 	= req.body.video.file.inputFileName;
	var startTime 	= req.body.video.file.ssString;
	var endTime   	= req.body.video.file.endString;
	var tournament 	= req.body.video.file.tournamentName;
	var round 		= req.body.video.file.round;
	var player1 	= req.body.video.file.player1;
	var player2		= req.body.video.file.player2;
	var output		= req.body.video.file.outputFileName;

	var filepath = path.join(filedir, filename);
    var duration = moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime,"HH:mm:ss"))).format("HH:mm:ss");


	var cmd =
		'ffmpeg -i ' + filepath + ' -ss ' + startTime + ' -t ' + duration + ' -acodec copy -vcodec copy ' + output;
    res.sendStatus(200);

	/*
	exec(cmd, function(err, stdout, stderr){
		if(err)
			log.error(err.stack);
		else if(stderr)
			log.error(stderr);
		else {
			log.info('complete');
			log.info(stdout);
			res(200);
        }
	});
	*/


    /*
	var process = new ffmpeg(path.join(filedir, filename));
	process.then(video => {
		video.setVideoFormat('mp4');
		video.setVideoCodec('copy');
		video.setAudioCodec('copy');
		video.setVideoStartTime(startTime);
		video.setVideoDuration(duration);
		video.save(output, function(err, file){
			if(err)
				log.error(err.stack);
			else{
				res(200)
			}
		})
	},
	function(err){
		if(err)
			log.error(err.stack);
	})
	.catch(function(err){
		if(err) {
            log.error(err.stack);
			log.error(err);
        }
	})
	*/

});

app.post('/createClipV2', function(req, res){
	var cmd = req.body.command;
	console.log('  [SERVER] FFMPEG running command');
	console.log('--------------------------------------\n');
	console.log(cmd + '\n');
	console.log('--------------------------------------\n');
	execSync(cmd);
	res.sendStatus(200);
});

app.post('/uploadLocalFile', function(req, res){
	var file = req.files;
	console.log(file);
	
	if(!req.files){	
		next();
	}
	else{
		console.log('file received');
		var buf = new Buffer(req.files.file.data.toString(), 'ascii');
		console.log('Received: \n' + buf.toString());
		
		try{
			var clips = parseFileToClipObject(buf);
			clips.forEach((obj) => {
				clip.createClip(obj.input, obj.startTime, obj.endTime, obj.output);
			});
		}catch(err){
			console.log(err);
			res.sendStatus(500);
		};
		
		res.sendStatus(200);
	}
	console.log('no file received');
	res.sendStatus(500);
});

var server = app.listen(portGl, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)

});

function parseFileToClipObject(fileBuffer){
	var clips = [];
	var bufStr = fileBuffer.toString();
	var lines = bufStr.split(';');
	var input, startTime, endTime, output;
	var tournamentName, player1, player2, round;
	
	var first = true;
	lines.forEach((line) => {
		if(line == "") return;
		var elements = line.split(',');
		if(first){
			input = elements[0].trim();
			tournamentName = elements[1].trim();
			first = false;
		}
		else{
			player1 = elements[0].trim();
			player2 = elements[1].trim();
			startTime = elements[2].trim();
			endTime  = elements[3].trim();
			round = elements[4].trim();
			
			tournamentName = tournamentName.replaceAll(" ", "_");
			player1 = player1.replaceAll(" ", "_");
			player2 = player2.replaceAll(" ", "_");
			round = round.replaceAll(" ", "_");
			output = (tournamentName + '-' + player1 + '-' + player2 + '-' + round + '.mp4').replaceAll(" ", "");
					
			var clip = {
				input: input,
				startTime: startTime, 
				endTime: endTime,
				output: output
			};
			
			clips.push(clip);
		}
	});
	
	return clips;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};