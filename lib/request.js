var request = require('request');

var getUrl = function(url) {
  var node = false;
  if (typeof window === 'undefined') {
    node = true;
  }
  
  if (!node) {
    url = 'https://cors-anywhere.herokuapp.com/' + url;
  }
  
  return url;
};

var get = function(url, cb) {
  url = getUrl(url);
  
  request(url, cb);
};

module.exports = {
  get: get
};