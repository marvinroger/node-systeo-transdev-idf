var should = require('chai').should();
var systeoTransdevIDF = require('../');

// Lines

describe('Lines', function(){
  describe('#getLines()', function(){
    it('should return a list of lines (test with J1)', function(done){
      systeoTransdevIDF.getLines(function(err, lines) {
        should.not.exist(err);
        lines.should.have.property('J1');
        done();
      });
    });
  });
  
  describe('#getStops()', function(){
    it('should return a list of stops (test with GARIBALDI)', function(done){
      systeoTransdevIDF.getStops(268435472, function(err, stops) {
        should.not.exist(err);
        stops.should.have.property('GARIBALDI');
        done();
      });
    });
  });
});

// Schedules

describe('Schedules', function(){
  describe('#getSchedules()', function(){
    it('should return a list of schedules', function(done){
      systeoTransdevIDF.getSchedules(268435472, 'GARIBALDI', function(err, schedules) {
        should.not.exist(err);
        if (!schedules.noMoreToday) {
          schedules.should.not.be.empty;
        }
        done();
      });
    });
  });
});
