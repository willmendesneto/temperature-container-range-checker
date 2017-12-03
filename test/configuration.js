var CONFIG = require('../src/configuration');

describe('Configuration', function() {
  describe('Temperature information', function() {
    it('should have the sensor port configured', function(){
      CONFIG.TEMPERATURE_RANGE_CHECKER.should.have.property('PIN').which.is.a.String()
    });

    it('should have the sensor alarm limit configured with minimum and maximum information', function(){
      CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.should.have.property('MINIMUM').which.is.a.Number()
      CONFIG.TEMPERATURE_RANGE_CHECKER.LIMIT.should.have.property('MAXIMUM').which.is.a.Number()
    });
  });

  it('should have the interval polling information', function(){
    CONFIG.should.have.property('INTERVAL').which.is.a.Number()
  });

});
