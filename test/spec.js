(function() {

  // This test checks the steel.js library for the required method interface.
  // `window.steel` should contain the following publicly accessible methods:
  //   steel.app()
  //   steel.service()
  //   steel.factory()
  //   steel.component()
  //
  test('Static Methods', function() {

    equal(typeof steel.app, 'function', 'app()');
    equal(typeof steel.factory, 'function', 'factory()');
    equal(typeof steel.service, 'function', 'service()');
    equal(typeof steel.component, 'function', 'component()');

  });

  // This test validates the execution order when scripts are loaded non-sequentially.
  // If gas.js is a dependency of automobile.js, the scripts should still exectue properly if 
  //   the html doc includes automobile.js before gas.js.
  //
  asyncTest('Dependency Loading and Execution', function() {

    expect(2);

    // Describing a example module that requires both automobile.js and mechanic.js
    steel.app(['automobile', 'mechanic'], function(auto, mech) {
      equal(auto._types[0], 'car', 'Module dependencies execute properly');
    });

    // Appending an asynchronous script after the document has fully loaded
    appendAsyncScript('deps/gas.js');

    // Describing a factory that requires the previously asynchronouly loaded script, gas.js
    steel.factory('pump', ['gas'], function(Gas) {
      equal(new Gas(2, 4, 10).totalCost, 18, 'Lazy loaded modules execute properly');
      start();
    });

  });

  // This test ensures that no two modules have the same name to prevent ambiguous dependency references.
  // It also checks to make sure a module is only executed once, 
  //   even if it is labeled as the dependency of 2 or more other modules.
  //
  asyncTest('Strict Module Definitions', function() {

    expect(2);

    // Confirming an error is thrown when a second "mechanic" module is defined
    function mechanicLoaded() {
      try {
        steel.service('mechanic', function() {});
      } catch (error) {
        ok(true, 'Expected functionality: cannot define same module name twice');
        start();
      }
    }

    // Callback for the first "mechanic" module to load
    steel.app(['mechanic'], function(mech) {
      setTimeout(mechanicLoaded, 0);
    });

    // The garage service labels automobile.js as a dependency, and checks the execution count, 
    //   expecting only 1 total execution of automobile.js's callback function
    steel.service('garage', ['automobile'], function(auto) {
      equal(auto.executions, 1, 'Expected functionality: module is executed only once and then cached');
    });

  });
  
  // This test checks for the allowance of optional parameters in module definitions.
  // All modules should only require a callback function in order to execute.
  //
  test('Optional Parameters', function() {

    // The name parameter should be optional in all module definitions
    steel.service(['automobile'], function(auto) {
      ok(true, 'Expected functionality: "name" parameter optional');
    });
  
    // The dependencies array parameter should be optional in all module definitions
    steel.service('driver', function() {
      complete = 2;
      ok(true, 'Expected functionality: "dependencies" parameter optional');
    });
  
    // The name and dependencies parameters should be optional in all module definitions
    steel.service(function() {
      ok(true, 'Expected functionality: "name" and "dependencies" parameters optional');
    });

  });

  // This test ensures that `component` modules only execute once the DOM is 'ready'
  // 
  test('Execution Triggers', function() {

    equal(jQuery('#shop').html(), 'BUSY', '"component" modules executed on DOM-ready');

  });


  // Helper function for appending script elements
  function appendAsyncScript(fileName) {
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = fileName;
    js.async = true;
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(js, first);
  }

}());
