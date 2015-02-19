node-systeo-transdev
====================

[![NPM version](https://badge.fury.io/js/systeo-transdev-idf.svg)](http://badge.fury.io/js/systeo-transdev-idf)
[![Build Status](https://travis-ci.org/marvinroger/node-systeo-transdev-idf.svg)](https://travis-ci.org/marvinroger/node-systeo-transdev-idf)

This NPM module retrieves the next practical and theorical schedules of the bus equiped with Systeo in Île-de-France.
It now only works with the STRAV network.

Be careful as this is very experimental for now.

## Features

* Get bus lines
* Get stops
* Get next schedules for a given bus line/stop
* Work on both server and client side, with Browserify and no dependencies (~80-85Ko)

## Usage

```javascript
var systeoTransdevIDF = require('systeo-transdev-idf');

// Lines

systeoTransdevIDF.getLines(function(err, lines) {
  if (err) { console.log(err.message);  };
  
  // lines = { 'J1': '268435472', ... } // nameOfTheLine: IDOfTheLine
});

// Stops

systeoTransdevIDF.getStops('268435472', function(err, stops) {
  if (err) { console.log(err.message);  };
  
  // stops = { 'GARIBALDI': 'GARIBALDI', ... } // nameOfTheStop: IDOfTheStop
});

// Schedules

systeoTransdevIDF.getSchedules('268435472', 'GARIBALDI', function(err, schedules) {
  if (err) { console.log(err.message);  };
  
  /* schedules = {
  *    'noMoreToday': false, // Are there still bus for today?
  *    'schedules': [{
  *      'realtime': true, // Is this realtime or theorical time?
  *      'pmr': true, // Bus with disabled facilities?
  *      'remainingTime': '1h16', // Representation of remaining time in minutes ('1h10' || '15')
  *      'destination': 'GARE DE VILLE.-ST-GEORGES',
  *      'via': 'GARE DE BOISSY-ST-LEGER' // Optional, if there is a via
  *    }]
  * };
  */
});
```