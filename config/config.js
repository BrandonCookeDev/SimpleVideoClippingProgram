var _ = require('lodash');

function getEnvironment() {
  if (process.env.NODE_ENV) {
    try {
      return require('./env/' + process.env.NODE_ENV + '.js');
    }
    catch(e) {
      console.error(e.message);
      console.log('No configuration file found for "' + process.env.NODE_ENV + '" environment using development environment file instead.');
    }
  }
  else {
    console.log('No value for NODE_ENV environment variable.  Using deployed environment file by default.');
  }
  
  try {
    return require('./env/deployed.js');
  }
  catch(e) {
    console.log('Unable to load development configuration file');
  }
  var empty = {};
  return empty;
}

module.exports = _.extend(
  require('./env/all'),
  getEnvironment()
);