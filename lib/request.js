var helpers = require('./helpers');
var request = require('request');

var createCORSRequest = function(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
};

var get = function(url, cb) {
  if (helpers.isNode()) {
    return request.get(url, cb);
  } else {
    var xhr = createCORSRequest('GET', 'https://cors-anywhere.herokuapp.com/' + url);
    if (!xhr) {
      return cb(new Error('CORS not supported'), null, null);
    }
    
    xhr.onload = function() {
      var body = xhr.responseText;
      var res = { statusCode: xhr.status };
      return cb(null, res, body);
    };

    xhr.onerror = function(e) {
      return cb(new Error('Fetch failed'), null, null);
    };

    xhr.send();
  }
};

module.exports = {
  get: get
};