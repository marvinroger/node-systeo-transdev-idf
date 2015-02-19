var http = require('http');
var ServerError = require('./errors').ServerError;
var helpers = require('./helpers');

var TIMEOUT = 3000;

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
    var req = http.get(url, function(res) {
      var body;
      
      res.on('data', function(chunk) {
        body += chunk;
      });
      
      res.on('end', function() {
        return cb(null, res, body);
      });
    }).on('error', function(err) {
      return cb(err, null, null);
    });
    req.setTimeout(TIMEOUT, function() {
      return cb(new ServerError('Request timed out'), null);
    });
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
    
    xhr.timeout = TIMEOUT;
    xhr.ontimeout = function() {
      return cb(new ServerError('Request timed out'), null);
    };

    xhr.send();
  }
};

module.exports = {
  get: get
};