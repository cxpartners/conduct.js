describe("Conduct.js", function() {

  var conduct = new Conduct({});

  it('should be available as a global', function(done) {
    expect(window.Conduct).toBeDefined();
    done();
  });

  it('should expose a single public method called "evaluate"', function(done) {

    // Loop over the publicly available properties on conduct and check it matches our expectations
    var properties = [];
    for(property in conduct) {
      properties.push(property);
    }
    expect(properties).toEqual(['evaluate']);

    // Check that evaluate is a function
    expect(typeof(conduct.evaluate)).toBe('function');

    done();
  });


});
