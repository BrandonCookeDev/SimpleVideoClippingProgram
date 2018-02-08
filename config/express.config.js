'use strict'

let express = require('express');
let bp      = require('body-parser');
let server  = express();
server.use(bp.json());
server.use(bp.urlencoded());

module.exports = server;