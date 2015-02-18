var htmlparser = require('htmlparser2');
var request = require('./request');
var networkErrorHandler = require('./networkErrorHandler');

/*
 * Regex groups:
 * #1: Status (contains '*' (PMR (equiped for disabled people)) || contains '!' (theorical time))
 * #2: Remaining time ('20' || '1h20')
 * #3: Destination ('GARE DE VILLE.-ST-GEORGES')
 * #4: Ignore
 * #5: Via ('GARE DE BOISSY-ST-LEGER' || undefined (no via))
 */

var REGEX = /([*!]{1,2})?[\s]+([0-9h]+)mn[\s]+Vers[\s]+([A-Z.'\-\s]+)([\sVia[\s]+([A-Z.'\-\s]+))?/;

var getSchedules = function(line, stop, cb) {
  request.get('http://wap.strav.mobi/horaireligne.php?ligne=' + line + '&arret=' + stop, function(err, res, body) {
    var errored = networkErrorHandler.handle(err, res);
    if (errored) { return cb(errored, null); }
    
    var rawSchedules = [];
    var eligible = false;
    var parser = new htmlparser.Parser({
      onopentag: function(name, attribs){
        if (name == 'td' && attribs.align == 'left'){
          eligible = true;
        } else {
          eligible = false;
        }
      },
      ontext: function(text){
        if (eligible) {
          rawSchedules.push(text);
        } else if (text == 'Plus de passage aujourd\'hui.') {
          return cb(null, { noMoreToday: true });
        }
      },
      onclosetag: function(name){}
    });
    parser.write(body);
    parser.end();
    
    var schedules = [];
    rawSchedules.forEach(function(rawSchedule) {
      var schedule = { realtime: true, pmr: false };
      var result = REGEX.exec(rawSchedule);
      
      if (typeof result[1] !== 'undefined') {
        if (result[1].indexOf('*') > -1) { schedule.pmr = true; }
        if (result[1].indexOf('!') > -1) { schedule.realTime = false; }
      }
      schedule.remainingTime = result[2];
      schedule.destination = result[3];
      if (typeof result[5] !== 'undefined') { schedule.via = result[5]; }
      
      schedules.push(schedule);
    });
    
    return cb(null, { noMoreToday: false, schedules: schedules });
  });
};


module.exports = {
  getSchedules: getSchedules
};