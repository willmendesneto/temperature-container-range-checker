var proxyquire = require('proxyquire');
var CONFIG = require('../src/configuration');
var five = require('johnny-five');
var request = require('request');
var sinon = require('sinon');
var TemperatureRangeChecker = require('../src/temperature-container-range-checker');

describe('TemperatureRangeChecker', function() {
  var temperatureRangeChecker;
  var createMessagesSpy;
  var sandbox = sinon.sandbox.create();
  var clock = sandbox.useFakeTimers();
  var lcdPrint = sandbox.spy();

  before(function(){
    sandbox.stub(console, 'info');
    sandbox.stub(five, 'LCD').callsFake(() => { return { print: lcdPrint }; });
    temperatureRangeChecker = new TemperatureRangeChecker();
  });

  afterEach(function() {
    clock.reset();
    sandbox.reset();
  });

  after(function(){
    clock.restore();
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
        sandbox.stub(temperatureRangeChecker, 'temperatureSensor').value({
          celsius: CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.MAXIMUM + 1
        });
      });

      beforeEach(function() {
        temperatureRangeChecker.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      it('should trigger piezo sensor alarm', function(){
        piezoPlaySpy.calledOnce.should.be.true;
      });

      it('should print message in LCD display', function(){
        lcdPrint.calledOnce.should.be.true;
        console.info.firstCall.args.should.be.eql(['Above to the limit: 31']);
        lcdPrint.firstCall.args.should.be.eql(['Above to the limit: 31']);
      });

    });

    describe('When the temperature is lower to the minimum limit', function(){

      beforeEach(function() {
        sandbox.stub(temperatureRangeChecker, 'temperatureSensor').value({
          celsius: CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.MINIMUM - 1
        });
        temperatureRangeChecker.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      it('should trigger piezo sensor alarm', function(){
        piezoPlaySpy.calledOnce.should.be.true;
      });

      it('should print message in LCD display', function(){
        lcdPrint.calledOnce.should.be.true;
        console.info.firstCall.args.should.be.eql(['Below to the limit: 9']);
        lcdPrint.firstCall.args.should.be.eql(['Below to the limit: 9']);
      });

    });

    describe('When the temperature is in the acceptable range', function(){

      before(function() {
        sandbox.stub(temperatureRangeChecker, 'temperatureSensor').value({
          celsius: CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.MINIMUM + 1
        });
      });

      beforeEach(function() {
        temperatureRangeChecker.startPolling();
        clock.tick(CONFIG.INTERVAL);
      });

      it('should NOT trigger piezo sensor alarm', function(){
        piezoPlaySpy.calledOnce.should.be.false;
      });

      it('should print message in LCD display', function(){
        lcdPrint.calledOnce.should.be.true;
        console.info.firstCall.args.should.be.eql(['Current temperature: 11']);
        lcdPrint.firstCall.args.should.be.eql(['Current temperature: 11']);
      });

    });

  });

});
