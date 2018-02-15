'use strict';
// console.log(module);
const mongoose = require('mongoose');

var crypto = require('crypto');
Promise.promisifyAll(crypto);

const UserSchema = mongoose.Schema({
    username: {type: String, unique: true},
    hashedPassword: {type: String, unique:false},
    salt: {type: String, unique: false}
});

UserSchema.statics.hashPassword = async function(password) {
    try{
        var salt = crypto.randomBytes(16).toString('base64');
        var iterations = 10000;
        var hash = null;
        
        let key = await crypto.pbkdf2Async(password, salt, iterations, 512, 'sha256');
        hash = (key.toString('hex'))
        
        return {
            hashedPassword: hash,
            iterations: iterations,
            salt: salt
        };
    } catch(e){
        //TODO log error
        throw e;
    }
}

module.exports = mongoose.model('User', UserSchema);