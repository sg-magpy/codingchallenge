var executions = 0;

steel.factory('automobile', ['mechanic'], function(mechanic) {
  executions++;
  return {
    _types: ['car', 'truck', 'bus', 'motorcycle'],
    isAvailable: function(type) {
      return this._types.indexOf(type) >= 0;
    },
    executions: executions
  };
});