var Clip = require('./lib/modules/Clips');
var Cli	 = require('./lib/modules/CLI');
var LocalVideo = require('./lib/modules/LocalVideo');
var Youtube	   = require('./lib/modules/Youtube');

//ADD MODULE TO THIS TO INIT ENDPOINTS LATER
var modules = [Clip, Cli, LocalVideo, Youtube];

var log 		= require('winston');
var express 	= require('express');
var bodyParser 	= require('body-parser');
var fileUpload 	= require('express-fileupload');
var execSync 	= require('child_process').execSync;

var portGl 		= 1337;
var hostGl 		= '127.0.0.1';
var publicDir 	= __dirname + '/../client';

var app = express();
app.use(express.static(publicDir));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(fileUpload());

//INIT MODULE ENDPOINTS
modules.forEach(function(module){
	module.endpoints(app);
    log.info('Loaded Module: ' + module.name);
});

app.get('/', function(req, res) {
	res.sendFile(publicDir + '/webapp/index.html');
});

app.post('/uploadFile', function(req, res){
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
		}
		
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