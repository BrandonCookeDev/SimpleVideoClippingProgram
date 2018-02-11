/**
 * endpoints for this module should include
 * 1) a POST url for making a clip of a video file
 *    - this will return a 202 In Progress status with a url (2) to query for the creation status
 * 2) a GET url that should send the status of a video's creation
 *    - this will return a true or false value based on if the specified clip has finished being created
 * 
 */
 
'use strict';

let express = require('express');
let router = express.Router();

let Clip = require('./clip');

module.exports = function(server){
    router.route('/clip/create').post(Clip.create);
    router.route('/clip.status/:id').get(Clip.status);
    express.use(router);
}
