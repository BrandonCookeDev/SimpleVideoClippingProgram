var Youtube	= require('./server/modules/youtube/youtube');
var youtube = new Youtube();
Youtube.init();

var _		= require('lodash');
var fs  	= require('fs');
var path 	= require('path');
var log 	= require('winston');
var ffmpeg 	= require('ffmpeg');
var moment  = require('moment');
const exec 		= require('child_process').exec;
const execSync 	= require('child_process').execSync;

var express 	= require('express');
var fileUpload 	= require('express-fileupload');
var bodyParser 	= require('body-parser');

var clip 		= require('./server/modules/clip/Clip.js');
var cache	= require('./server/modules/cache/cache').instance;

var portGl = 1337;
var hostGl = '127.0.0.1';

/** DIRECTORY TO LIST EDITABLE VIDEOS **/
var videoDir = path.join(__dirname, 'client', 'videos');

var app = express();
app.use("/", express.static(path.join(__dirname,'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(fileUpload());

var i = 0;
var clipCreationQueue = [];

/** ADD MDOULAR ENDPOINTS **/
require('./server/modules/youtube/endpoints')(app);
require('./server/modules/cache/endpoints')(app);
require('./server/modules/clip/endpoints')(app);

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.get('/home', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/listVideoDirectory', function(req, res){
	try {
        fs.readdir(videoDir, function (err, items) {
            if (err) {
            	log.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).send(items);
        })
    }catch(err){
        if (err) {
            log.error(err);
            return res.status(500).send(err);
        }
        return res.sentStatus(500);
	}
});

app.get('/getVideo/:filename', function(req, res){
	try{
		var filename = req.params.filename;
		var filepath = path.join(videoDir, filename);
		res.sendFile(filepath);
	}catch(err){
        if (err) {
            log.error(err);
            return res.status(500).send(err);
        }
        return res.sentStatus(500);
	}
});

/*
	var process = new ffmpeg(path.join(filedir, filename));
	process.then(video => {
		video.setVideoFormat('mp4');
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