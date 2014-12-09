(function() {

  // Check library for required method interface
  test('Static Methods', function() {

    equal(typeof steel.app, 'function', 'app()');
    equal(typeof steel.factory, 'function', 'factory()');
    equal(typeof steel.service, 'function', 'service()');
    equal(typeof steel.component, 'function', 'component()');

  });

  // Validate execution order when loaded non-sequentially
  asyncTest('Dependency Loading and Execution', function() {

    expect(2);

    steel.app(['automobile', 'mechanic'], function(auto, mech) {
      equal(auto._types[0], 'car', 'Module dependencies execute properly');
    });

    appendAsyncScript('deps/gas.js');

    steel.factory('pump', ['gas'], function(Gas) {
      equal(new Gas(2, 4, 10).totalCost, 18, 'Lazy loaded modules execute properly');
      start();
    });

  });

  // Confirm name collision protection
  asyncTest('Strict Module Definitions', function() {

    expect(5);

    // test confirming an error is thrown when a second "mechanic" module is defined
    function mechanicLoaded() {
      try {
        steel.service('mechanic', function() {});
      } catch (error) {
        ok(true, 'Expected functionality: cannot define same module name twice');
        start();
      }
    }

    // callback for the first "mechanic" module to load
    steel.app(['mechanic'], function(mech) {
      setTimeout(mechanicLoaded, 0);
    });

    steel.service('garage', ['automobile'], function(auto) {
      equal(auto.executions, 1, 'Expected functionality: module is executed only once and then cached');
    });

    steel.service(['automobile'], function(auto) {
      ok(true, 'Expected functionality: "name" parameter optional');
    });

    steel.service('driver', function() {
      complete = 2;
      ok(true, 'Expected functionality: "dependencies" parameter optional');
    });

    steel.service(function() {
      ok(true, 'Expected functionality: "name" and "dependencies" parameters optional');
    });

  });

  // Wait for DOM ready before executing "component" modules.
  test('Execution Triggers', function() {

    equal(jQuery('#shop').html(), 'BUSY', '"component" modules executed on DOM-ready');

  });


  // Append script element helper function
  function appendAsyncScript(fileName) {
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = fileName;
    js.async = true;
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(js, first);
  }

}());