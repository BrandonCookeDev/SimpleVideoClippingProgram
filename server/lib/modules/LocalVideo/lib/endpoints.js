var express = require('express');
var router  = express.Router();

var ctrl    = require('./controller');

module.exports = function(server){
    router.route('/localVideo/upload').post(ctrl.upload);
    server.use(router);
};