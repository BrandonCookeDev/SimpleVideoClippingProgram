'use strict';

let path = require('path');

// Setup Winston logging
let log        = require('winston');
let transports = config.log.transports;
log.remove(log.transports.Console);

if(transports.console) log.add({
    level: 'debug',
    json: false,
    handleExceptions: true,
    colorize: true
}, transports.console);

if(transports.file) log.add({
    filename: path.join(__dirname, 'logs', 'cookiecutter.log');
    level: 'error',
    json: false,
    handleExceptions: true,
    colorize: false
}, transports.file);

module.exports = log;