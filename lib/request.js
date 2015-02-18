var request = require('request');
var request = require('ahr2');

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
  
  request.get(url).when(cb);
};

module.exports = {
  get: get
};