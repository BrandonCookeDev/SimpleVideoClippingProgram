'use strict';
// console.log(module);
const crypto = require('crypto');
const mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String, unique: true}
});

UserSchema.methods.hashPassword = function(password) {
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret)
                   .update(password)
                   .digest('hex');
}

module.exports = mongoose.model('User', UserSchema);