var log = require('winston');

class CliController{

    create(req, res){
        try {
            var cmd = req.body.command;
            console.log('  [SERVER] FFMPEG running command');
            console.log('--------------------------------------\n');
            console.log(cmd + '\n');
            console.log('--------------------------------------\n');
            execSync(cmd);
            res.sendStatus(200);
        }
        catch(err) {
            log.error(err.stack);
            res.send(500, err.message);
        }
    }
}

module.exports = CliController;