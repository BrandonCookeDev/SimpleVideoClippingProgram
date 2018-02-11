'use strict';

let log = require('winston');

let mongoose = require('mongoose');

async function mongooseSetup(){
    try{
        log.info('Initializing mongo');
        let url = 'mongodb://localhost/cookiEcutter';
        mongoose.connect(url);
        
        mongoose.connection.on('connected', function(){
            try{
                log.info('Mongoose connected to %s', url);
            } catch(e){
                log.error('mongoose connected event: %s', e);
            }
        })
        
        mongoose.connection.on('disconnected', function(){
            try{
                log.warn('Mongoose was disconnected. Retrying connection...')
                mongoose.connect(url);
            } catch(){
                log.error('mongo disconnected event: %s', e);
            }
        })
        
    } catch(e){
        log.error('mongoose config: %s', e);
    }
}

mongooseSetup();