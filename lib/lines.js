var htmlparser = require('htmlparser2');
var request = require('./request');
var networkErrorHandler = require('./networkErrorHandler');

var getList = function(url, cb) {
  request.get(url, function(err, res, body) {
    var errored = networkErrorHandler.handle(err, res);
    if (errored) { return cb(errored, null); }
    
    var result = {};
    var lastID;
    var lastName;
    var parser = new htmlparser.Parser({
      onopentag: function(name, attribs){
        if(name == 'option'){
          lastID = attribs.value;
        }
      },
      ontext: function(text){
        lastName = text;
      },
      onclosetag: function(name){
        if(name == 'option'){
          result[lastName] = lastID;
        }
      }
    });
    parser.write(body);
    parser.end();
    
    return cb(null, result);
  });
};

var getLines = function(cb) {
  getList('http://wap.strav.mobi/horaireligne.php', cb);
};

var getStops = function(line, cb) {
  getList('http://wap.strav.mobi/horaireligne.php?ligne=' + line, cb);
};


module.exports = {
  getLines: getLines,
  getStops: getStops
};