var lines = require('./lib/lines');
var schedules = require('./lib/schedules');
var ServerError = require('./lib/errors').ServerError;

module.exports = {
  getLines: lines.getLines,
  getStops: lines.getStops,
  getSchedules: schedules.getSchedules,
  ServerError: ServerError
};