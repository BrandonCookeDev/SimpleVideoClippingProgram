'use strict'

let winston = require('winston');

let ConsoleTransport = new winston.transports.Console({
	name: '../logs/CookieCutter-Server.log',
	colorize: true,
	handleException: false,
	level: 'warning',


})

let FileTransport = new winston.transports.File({
	filename: '../logs/CookieCutter-Server.log',
	colorize: true,
	handleException: false,
	level: 'debug',
	json: false,
	maxsize: 524880
})

let Logger = new winston.Logger({
	transports: [
		FileTransport
	]
});

module.exports = Logger;