var co = require('co');
var log = require('winston');

var Clip = require('./clip');

class ClipController{

    static createClip(req, res){
        co(function*(){
            var input 	  = req.body.input;
            var startTime = req.body.startTime;
            var endTime   = req.body.endTime;
            var output	  = req.body.output;

            var clip = new Clip(input, startTime, endTime, output);
            var clipFile = yield clip.generate();
            res.send(200);
        }).catch(function(err){
            log.error(err.stack);
            res.send(500, err.message);
        })
    }
}

module.exports = ClipController;