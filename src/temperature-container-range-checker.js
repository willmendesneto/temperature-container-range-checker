var CONFIG = require('./configuration');
var five = require('johnny-five');
var intervalId = null;

class TemperatureRangeChecker {
  constructor() {
    this.piezo = new five.Piezo(3);
    this.lcd = new five.LCD({ pins: [7, 8, 9, 10, 11, 12] });
    this.temperatureSensor = new five.Thermometer({
      pin: CONFIG.TEMPERATURE_RANGE_CHECKER.PIN,
      toCelsius: function(rawVoltage) {
        var temperature = 0;
        temperature = Math.log(10000.0*((1024.0/rawVoltage-1)));
        temperature = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * temperature * temperature ))* temperature );
        // Convert Kelvin to Celcius
        temperature = temperature - 273.15;
        return Math.floor(temperature);
      }
    });
  }

  stopPolling() {
    clearInterval(intervalId);
  }

  startPolling() {
    var self = this;
    let message = '';
    intervalId = setInterval(function() {
      var isTemperatureAboveTheMaximum = self.temperatureSensor.celsius >= CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.MAXIMUM;
      var isTemperatureBelowTheMinimum = self.temperatureSensor.celsius <= CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.MINIMUM;
      if (isTemperatureAboveTheMaximum && !self.piezo.isPlaying) {

        self.piezo.play({
          song: [
            ['G5', 1/4],
            [null, 7/4]
          ],
          tempo: 200
        });
        message = `Above to the limit: ${self.temperatureSensor.celsius}`;
      } else if (isTemperatureBelowTheMinimum && !self.piezo.isPlaying) {
        self.piezo.play({
          song: [
            ['G5', 1/4],
            [null, 7/4]
          ],
          tempo: 200
        });

        message = `Below to the limit: ${self.temperatureSensor.celsius}`;
      } else {
        message = `Current temperature: ${self.temperatureSensor.celsius}`;
      }

      console.info(message);
      self.lcd.print(message);
    }, CONFIG.INTERVAL);
  }
}

module.exports = TemperatureRangeChecker;
