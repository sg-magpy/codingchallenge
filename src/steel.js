window.steel = function () {
	return {
		// Modules are cached here once they are loaded
		cachedModules: {},

		// Structure to maintain list of modules waiting for their dependencies
		waitingModules: [],

		// Set to true when the DOMContentLoaded event is fired
		domReady: false,

		cacheModule: function(moduleName, module) {
			'use strict';

			if (this.cachedModules[moduleName] === undefined) {
				this.cachedModules[moduleName] = module;
			} else {
				throw 'Unallowed operation: Tried to define module ' + moduleName + ' more than once';
			}
		},

		processWaitingModules: function() {
			'use strict';

			var numWaitingModules = this.waitingModules.length;

			// Process the list of waiting modules to see if their dependencies are ready
			for (var i = 0; i < this.waitingModules.length; i++) {
				var waitingModule = this.waitingModules[i],
					moduleName = waitingModule.name,
					moduleDeps = waitingModule.dependencies,
					moduleCallback = waitingModule.callback,
					moduleShouldWaitForDom = waitingModule.waitForDom,
					allLoaded = true, 
					loadedModules = [];

				for (var j = 0; j < moduleDeps.length; j++) {
					var moduleDependency = moduleDeps[j];

					// Check if the module is already cached
					// If so, add it to the list of loaded dependencies
					// If not, exit the loop early to process the next waiting module
					if (!this.cachedModules.hasOwnProperty(moduleDependency)) {
						allLoaded = false;
						break;
					} else {
						loadedModules.push(this.cachedModules[moduleDependency]);
					}
				}

				// All the module's dependencies are cached/loaded
				if (allLoaded === true) {

					// If this module needs to wait for the DOM to be ready, and it's not ready,
					// continue to the next waiting module for processing
					if (moduleShouldWaitForDom === true && this.domReady === false) {
						continue;
					}

					// Invoke the module's callback with the loaded dependencies
					// Cache the result using the module name as the key
					if (typeof moduleName !== 'undefined') {
						this.cacheModule(moduleName, moduleCallback.apply(null, loadedModules));
					} 

					// No module name provided so just invoke the callback with the loaded dependencies
					else {
						if (loadedModules.length > 0) {
							moduleCallback.apply(null, loadedModules);
						} else {
							moduleCallback();
						}
					}

					// Remove the now-loaded module from the list of waiting modules
					this.waitingModules.splice(i, 1);

					// Exit the loop early since we've modified the list of waiting modules
					break;
				}
			}

			// If the list of waiting modules changed, call this method again to resolve more dependencies
			if (numWaitingModules !== this.waitingModules.length) {
				this.processWaitingModules();
			}
		},

		app: function() {
			'use strict';

			var name, 
				dependencies, 
				module, 
				argsLength = arguments.length;
			
			if (argsLength === 1) {
				module = arguments[0];
			} else if (argsLength === 2) {
				if (typeof arguments[0] === 'string') {
					name = arguments[0];
				} else if (Array.isArray(arguments[0])) {
					dependencies = arguments[0];
				} else {
					throw 'Invalid argument at index 0; expected string or array';
				}

				module = arguments[1];
			} else if (argsLength === 3) {
				if (typeof arguments[0] === 'string') {
					name = arguments[0];
				} else {
					throw 'Invalid argument at index 0; expected string';
				}

				if (Array.isArray(arguments[1])) {
					dependencies = arguments[1];
				} else {
					throw 'Invalid argument at index 1; expected array';
				}

				if (typeof arguments[2] === 'function') {
					module = arguments[2];
				} else {
					throw 'Invalid argument at index 2; expected function';
				}
			}

			if (typeof name !== 'undefined' && typeof dependencies !== 'undefined') {
				this.waitingModules.push({ 'name': name, 'dependencies': dependencies, 'callback': module });
			} else if (typeof dependencies !== 'undefined') {
				this.waitingModules.push({ 'dependencies': dependencies, 'callback': module });
			} else if (typeof name !== 'undefined') {
				this.cacheModule(name, module());
				this.processWaitingModules();
			} else {
				module();
			}
		},

	 	factory: function() {
			'use strict';

			var name, 
				dependencies, 
				module, 
				argsLength = arguments.length;
			
			if (argsLength === 1) {
				module = arguments[0];
			} else if (argsLength === 2) {
				if (typeof arguments[0] === 'string') {
					name = arguments[0];
				} else if (Array.isArray(arguments[0])) {
					dependencies = arguments[0];
				} else {
					throw 'Invalid argument at index 0; expected string or array';
				}

				module = arguments[1];
			} else if (argsLength === 3) {
				if (typeof arguments[0] === 'string') {
					name = arguments[0];
				} else {
					throw 'Invalid argument at index 0; expected string';
				}

				if (Array.isArray(arguments[1])) {
					dependencies = arguments[1];
				} else {
					throw 'Invalid argument at index 1; expected array';
				}

				if (typeof arguments[2] === 'function') {
					module = arguments[2];
				} else {
					throw 'Invalid argument at index 2; expected function';
				}
			}

			if (typeof name !== 'undefined' && typeof dependencies !== 'undefined') {
				this.waitingModules.push({ 'name': name, 'dependencies': dependencies, 'callback': module });
			} else if (typeof dependencies !== 'undefined') {
				this.waitingModules.push({ 'dependencies': dependencies, 'callback': module });
			} else if (typeof name !== 'undefined') {
				this.cacheModule(name, module());
				this.processWaitingModules();
			} else {
				module();
			}
		},

		service: function() {
			'use strict';

			var name, 
				dependencies, 
				module, 
				argsLength = arguments.length;

			if (argsLength === 1) {
				module = arguments[0];
			} else if (argsLength === 2) {
				if (typeof arguments[0] === 'string') {
					name = arguments[0];
				} else if (Array.isArray(arguments[0])) {
					dependencies = arguments[0];
				} else {
					throw 'Invalid argument at index 0; expected string or array';
				}

				module = arguments[1];
			} else if (argsLength === 3) {
				if (typeof arguments[0] === 'string') {
					name = arguments[0];
				} else {
					throw 'Invalid argument at index 0; expected string';
				}

				if (Array.isArray(arguments[1])) {
					dependencies = arguments[1];
				} else {
					throw 'Invalid argument at index 1; expected array';
				}

				if (typeof arguments[2] === 'function') {
					module = arguments[2];
				} else {
					throw 'Invalid argument at index 2; expected function';
				}
			}

			if (typeof name !== 'undefined' && typeof dependencies !== 'undefined') {
				this.waitingModules.push({ 'name': name, 'dependencies': dependencies, 'callback': module });
			} else if (typeof dependencies !== 'undefined') {
				this.waitingModules.push({ 'dependencies': dependencies, 'callback': module });
			} else if (typeof name !== 'undefined') {
				this.cacheModule(name, module());
				this.processWaitingModules();
			} else {
				module();
			}
		},

		component: function() {
			'use strict';

			var name, 
				dependencies, 
				module, 
				argsLength = arguments.length;
			
			if (argsLength === 1) {
				module = arguments[0];
			} else if (argsLength === 2) {
				if (typeof arguments[0] === 'string') {
					name = arguments[0];
				} else if (Array.isArray(arguments[0])) {
					dependencies = arguments[0];
				} else {
					throw 'Invalid argument at index 0; expected string or array';
				}

				module = arguments[1];
			} else if (argsLength === 3) {
				if (typeof arguments[0] === 'string') {
					name = arguments[0];
				} else {
					throw 'Invalid argument at index 0; expected string';
				}

				if (Array.isArray(arguments[1])) {
					dependencies = arguments[1];
				} else {
					throw 'Invalid argument at index 1; expected array';
				}

				if (typeof arguments[2] === 'function') {
					module = arguments[2];
				} else {
					throw 'Invalid argument at index 2; expected function';
				}
			}

			if (typeof name !== 'undefined' && typeof dependencies !== 'undefined') {
				this.waitingModules.push({ 'name': name, 'dependencies': dependencies, 'callback': module, 'waitForDom': true });
			} else if (typeof dependencies !== 'undefined') {
				this.waitingModules.push({ 'dependencies': dependencies, 'callback': module, 'waitForDom': true });
			} else if (typeof name !== 'undefined') {
				// If the DOM is ready, execute the callback and cache the module
				// Otherwise, add it to the list of waiting modules
				if (this.domReady === true) {
					this.cacheModule(name, module());
					this.processWaitingModules();
				} else {
					this.waitingModules.push({ 'name': name, 'callback': module, 'waitForDom': true });
				}
			} else {
				// If the DOM is ready, execute the callback
				// Otherwise, add it to the list of waiting modules
				if (this.domReady === true) {
					module();
				} else {
					this.waitingModules.push({ 'callback': module, 'waitForDom': true });
				}
			}
		}
	}
}();

document.addEventListener('DOMContentLoaded', function() {
	window.steel.domReady = true;
	window.steel.processWaitingModules();
});

