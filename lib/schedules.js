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

var REGEX_SCHEDULE = /([*!]{1,2})?[\s]+([0-9h]+)mn[\s]+Vers[\s]+([A-Z.'\-\s]+)([\sVia[\s]+([A-Z.'\-\s]+))?/g;
var STRING_NOMORETODAY = "Plus de passage aujourd'hui.";

var getSchedules = function(line, stop, cb) {
  request.get('http://wap.strav.mobi/horaireligne.php?ligne=' + line + '&arret=' + stop, function(err, res, body) {
    var errored = networkErrorHandler.handle(err, res);
    if (errored) { return cb(errored, null); }
    
    var schedules = [];
    var result;
    while((result = REGEX_SCHEDULE.exec(body)) !== null) {
      var schedule = { realtime: true, pmr: false };
      
      if (typeof result[1] !== 'undefined') {
        if (result[1].indexOf('*') > -1) { schedule.pmr = true; }
        if (result[1].indexOf('!') > -1) { schedule.realTime = false; }
      }
      schedule.remainingTime = result[2];
      schedule.destination = result[3];
      if (typeof result[5] !== 'undefined') { schedule.via = result[5]; }
      
      schedules.push(schedule);
    }
    
    if (schedules.length === 0) {
      if (body.search(STRING_NOMORETODAY) > -1) {
        return cb(null, { noMoreToday: true });
      } else {
        return cb(new Error('Server sent a malformed content'), null);
      }
    } else {
      return cb(null, { noMoreToday: false, schedules: schedules });
    }
  });
};


module.exports = {
  getSchedules: getSchedules
};