var TemperatureRangeChecker = require('./temperature-container-range-checker');
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  temperatureRangeChecker = new TemperatureRangeChecker();
  temperatureRangeChecker.startPolling();
});
