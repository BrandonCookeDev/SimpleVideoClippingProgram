let path = require('path');

module.exports = {
    data:{
        directories: {
            directory1: path.join(__dirname, '../../../../../client/'),
            directory2: path.join(__dirname, '../../../../../')
        },
        files: {
            file1: 'index.html',
            file2: 'package.json'
        }
    },
    expected: {
        resolved: {
            resolved1: '/Users/bcooke/Documents/Workspace/RCSCookieCutter/client/index.html',
            resolved2: '/Users/bcooke/Documents/Workspace/RCSCookieCutter/package.json'
        },
        files: {
            file1:{
                size: 11374
            },
            file2:{
                size: 882
            }
        }
    }
}