steel.service('gas', function() {
  return function(cardNumber, type, time) {
    this.totalCost = cardNumber * type + time;
  };
});