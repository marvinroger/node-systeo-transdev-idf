var lines = require('./lib/lines');
var schedules = require('./lib/schedules');

module.exports = {
  getLines: lines.getLines,
  getStops: lines.getStops,
  getSchedules: schedules.getSchedules
};