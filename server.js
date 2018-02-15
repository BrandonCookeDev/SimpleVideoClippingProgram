'use strict';
// c9 doesn't like modifying the global 'Promise', just ignore it
Promise = require('bluebird');
// Express
const express = require('express');
const path = require('path'); // maybe need to use this for static hosting for frontend?
const app = express();

// JSON and URL encoded parsing
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// GZIP compression
const compression = require('compression');

// Static hosting of frontend
app.use(express.static(__dirname + '/app/frontend'));

// Configure winston
const winston = require('winston');

// Configure mongoose/mongo
const mongoose = require('mongoose');
const User = require('./app/middleware/models/user');
// mongoose.connect('mongodb://localhost/rcscutter', {useMongoClient: true});

// Server
app.get('/', (req, res) => {
    res.send('Yo whaddup Im Jarrod. Im 19 years old. And I never learned how to make a f**king server.');
});

app.listen(8080, () => {
    console.log("Listening at port 8080");
});