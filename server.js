'use strict';

Promise = require('bluebird');

let config = require('./config/config');

// This will give us a public endpoint to give to others 
//  access to cookie cutter from anywhere.
// TODO register endpoint with Youtube API.
let ngrok = Promise.promisifyAll(require('ngrok'));

let log = require('./config/winston.config');
let server = require('./config/express.config');


launchServer();
async function launchServer(){
    let hostname = await ngrok.connectAsync(config.server.port);
    
}