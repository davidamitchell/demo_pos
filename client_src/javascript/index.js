document.addEventListener('DOMContentLoaded', function() {
  var basket = require ("../../modules/basket");

  var basket_el = document.getElementById('basket')
  basket_el.innerHTML = basket.html

  basket.bindEvents()

}, false);
