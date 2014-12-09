steel.service('mechanic', function() {
  return function(name) {
    this.name = name;
    this.clockedIn = true;
  };
});