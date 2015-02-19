var ServerError = require('./errors').ServerError;
var request = require('./request');
var networkErrorHandler = require('./networkErrorHandler');

var REGEX_LIST = /<option value=["']([[0-9A-Z.'\-\s]+)["']>([0-9A-Z.'\-\s]+)<\/option>/g;
var STRING_UNKNOWN_LINE = 'Ligne inconnue';
var STRING_UNKNOWN_STOP = "Nom de l'arr&ecirc;t inconnu";

var getList = function(url, cb) {
  request.get(url, function(err, res, body) {
    var errored = networkErrorHandler.handle(err, res);
    if (errored) { return cb(errored, null); }
    
    var list = {};
    var result;
    while((result = REGEX_LIST.exec(body)) !== null) {      
      list[result[2]] = result[1];
    }
    
    if (Object.keys(list).length === 0) {
      if (body.search(STRING_UNKNOWN_LINE) > -1) {
        return cb(new Error('The line does not exist'), null);
      } else if (body.search(STRING_UNKNOWN_STOP) > -1) {
        return cb(new Error('The stop does not exist'), null);
      } else {
        return cb(new ServerError('No lines/stops returned'), null);
      }
    } else {
      return cb(null, list);
    }
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
  getStops: getStops,
  STRING_UNKNOWN_LINE: STRING_UNKNOWN_LINE,
  STRING_UNKNOWN_STOP: STRING_UNKNOWN_STOP
};