'use strict';

Promise = require('bluebird');

let fs = require('fs');
let path = require('path');

let config  = require('./config/config');

// This will give us a public endpoint to give to others 
//  access to cookie cutter from anywhere.
// TODO register endpoint with Youtube API.
let ngrok   = Promise.promisifyAll(require('ngrok'));

let log     = require('./config/winston.config');
let server  = require('./config/express.config');

const VIDEOS_DIR = path.join(__dirname, 'client', 'videos');

launchServer();
async function launchServer(){
    try{
        if(!fs.existsSync(VIDEOS_DIR))
            fs.mkdirSync(VIDEOS_DIR)
            
        let hostname = await ngrok.connectAsync(config.server.port);
        server.listen(config.server.port, function(err){
            if(err){
                log.error('Error launching server: %s', err);
                process.exit(1);
            }
            else log.info('Server listening on port %s', config.server.port);
        })
    } catch(e){
        log.error('Error launching server: %s', e);
        process.exit(2);
    }
}