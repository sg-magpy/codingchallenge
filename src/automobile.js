steel.factory('automobile', ['mechanic'], function(mechanic) {
  return {
    _types: ['car', 'truck', 'bus', 'motorcycle'],
    isAvailable: function(type) {
      return this._types.indexOf(type) >= 0;
    }
  };
});