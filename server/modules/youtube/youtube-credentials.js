'use strict';

let ip = require('ip');
console.log(ip.address());


module.exports = {
    "web": {
        "client_id": "1063526789949-1nphpobeh9t5naah66rnmaslidlh1e4i.apps.googleusercontent.com",
        "project_id": "sgnpr-1325",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "YIn0zW8mOMOnCRHiA0NuIDFR",
        "redirect_uris": ["http://localhost:1337/youtube/authenticate"],
        "javascript_origins": ["http://localhost:1337"]
    }
}