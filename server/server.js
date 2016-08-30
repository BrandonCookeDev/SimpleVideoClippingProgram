var express = require('express');
var bodyParser = require('body-parser');
const execSync = require('child_process').execSync;

var portGl = 1337;
var hostGl = '127.0.0.1';

var app = express();
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.get('/home', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/createClip', function(req, res){
	var cmd = req.body.command;
	console.log('  [SERVER] FFMPEG running command');
	console.log('--------------------------------------\n');
	console.log(cmd + '\n');
	console.log('--------------------------------------\n');
	execSync(cmd);
	res.sendStatus(200);
});

var server = app.listen(portGl, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});