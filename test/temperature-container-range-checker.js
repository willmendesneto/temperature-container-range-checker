var proxyquire = require('proxyquire');
var CONFIG = require('../src/configuration');
var five = require('johnny-five');
var request = require('request');
var sinon = require('sinon');
var TemperatureRangeChecker = require('../src/temperature-container-range-checker');

describe('TemperatureRangeChecker', function() {
  var temperatureRangeChecker;
  var sandbox;
  var createMessagesSpy;

  before(function() {
    sandbox = sinon.sandbox.create();
  });

  beforeEach(function(){
    temperatureRangeChecker = new TemperatureRangeChecker();
  });

  afterEach(function() {
    sandbox.reset();
  });

  after(function(){
    sandbox.restore();
  });

  it('should have the termometer sensor configured', function(){
    (temperatureRangeChecker.temperatureSensor instanceof five.Thermometer).should.be.equal(true);
  });

  describe('#stopPolling', function(){
    beforeEach(function(){
      sandbox.spy(global, 'clearInterval');
      temperatureRangeChecker.stopPolling();
    });

    it('should remove interval', function(){
      global.clearInterval.calledOnce.should.be.true;
    });
  });


  describe('#toCelsius', function(){
    it('should transform raw voltage to celsius value', function(){
      temperatureRangeChecker.temperatureSensor.toCelsius(500.323).should.be.exactly(23);
    });
  });

  describe('#startPolling', function(){
    var piezoPlaySpy;
    var clock;

    before(function() {
      sandbox.spy(global, 'setInterval');
    });

    beforeEach(function(){
      piezoPlaySpy = sandbox.spy();

      var piezoStub = {
        isPlaying: false,
        play: piezoPlaySpy
      };
      sandbox.stub(temperatureRangeChecker, 'piezo').value(piezoStub);

      temperatureRangeChecker.startPolling();
    });

    it('should creates polling', function(){
      global.setInterval.calledOnce.should.be.true;
    });

    describe('When the temperature is up to the maximum limit', function(){

      before(function() {
        clock = sandbox.useFakeTimers();

        sandbox.stub(temperatureRangeChecker, 'temperatureSensor').value({
          celsius: CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.MAXIMUM + 1
        });
      });

      beforeEach(function() {
        temperatureRangeChecker.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      afterEach(function(){
        clock.reset();
      });

      after(function(){
        clock.restore();
      });

      it('should trigger piezo sensor alarm', function(){
        piezoPlaySpy.calledOnce.should.be.true;
      });

    });

    describe('When the temperature is NOT up to the maximum limit', function(){

      beforeEach(function() {
        clock = sandbox.useFakeTimers();

        sandbox.stub(temperatureRangeChecker, 'temperatureSensor').value({
          celsius: CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.MAXIMUM - 1
        });

        temperatureRangeChecker.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      afterEach(function(){
        clock.restore();
      });

      after(function(){
        clock.restore();
      });

      it('should NOT trigger piezo sensor alarm', function(){
        piezoPlaySpy.calledOnce.should.be.false;
      });

    });

    describe('When the temperature is lower to the minimum limit', function(){

      beforeEach(function() {
        clock = sandbox.useFakeTimers();

        sandbox.stub(temperatureRangeChecker, 'temperatureSensor').value({
          celsius: CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.MINIMUM - 1
        });
        temperatureRangeChecker.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      afterEach(function(){
        clock.restore();
      });

      after(function(){
        clock.restore();
      });

      it('should trigger piezo sensor alarm', function(){
        piezoPlaySpy.calledOnce.should.be.true;
      });

    });

    describe('When the temperature is NOT lower to the minimum limit', function(){

      before(function() {
        clock = sandbox.useFakeTimers();

        sandbox.stub(temperatureRangeChecker, 'temperatureSensor').value({
          celsius: CONFIG.TEMPERATURE_RANGE_CHECKER.MINIMUM + 1
        });
      });

      beforeEach(function() {

        temperatureRangeChecker.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      afterEach(function(){
        clock.restore();
      });

      after(function(){
        clock.restore();
      });

      it('should NOT trigger piezo sensor alarm', function(){
        piezoPlaySpy.calledOnce.should.be.false;
      });

    });

  });

});
