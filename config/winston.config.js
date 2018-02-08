'use strict';

let fs   = require('fs');
let path = require('path');

const LOG_DIR  = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'cookiecutter.log');

// Create log dir and file if not exists
if(!fs.existsSync(LOG_DIR)){
    fs.mkdirSync(LOG_DIR);
};
if(!fs.existsSync(LOG_FILE)){
    fs.openSync(LOG_FILE, 'w+');
};

// Setup Winston logging
let log = require('winston');

 //remove the default Console settings
log.remove(log.transports.Console);

log.add(log.transports.Console, {
    level: 'debug',
    json: false,
    handleExceptions: true,
    colorize: true
});

log.add(log.transports.File, {
    filename: LOG_FILE,
    level: 'error',
    json: false,
    handleExceptions: true,
    colorize: false
});

module.exports = log;