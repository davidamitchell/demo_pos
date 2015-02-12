//module.exports = require('./basket')

var basket = new function(){
  var fs = require('fs')
  var products = require("../products")

  var add = fs.readFileSync(__dirname + '/add.html', 'utf8');
  var list = fs.readFileSync(__dirname + '/list.html', 'utf8');
  var full_basket = {
    token_identifier: "123",
    basket: {
      items: [],
      totals: []
    }
  }
  var total = 0.0

  var addLi = function(text) {
    var ul = document.getElementById("basket_list");
    var lis = document.getElementsByClassName("basket_list_item")
    var li = lis[0].cloneNode(true);
    li.classList.remove("hidden")
    var name_el = li.querySelector(".name")
    var price = products.keyedHash[text]
    name_el.innerHTML = text + '<span style="float:right;">$' + price + '</span>'

    var product_data = {
      code: text,
      name: text
    }
    var currency_amounts = [
    {
      currency_code: "NZD",
      amount:        price
    }
    ]
    var basket_item = {
      "quantity": 1,
      "currency_amounts": [currency_amounts],
      "product_data": product_data
    }
    full_basket.basket.items.push(basket_item)
    ul.appendChild(li)
    console.log(full_basket)
    total += parseFloat(price)

    var total_el = document.getElementById('total')
    total_el.value = total
  }

  this.html = add + list

  this.bindEvents = function(){
    var new_item_el = document.getElementById('new_item')

    var Typeahead = require('typeahead');

    // source is an array of items
    var ta = Typeahead(new_item_el, {
      source: products.list
    });

    new_item_el.onkeypress = function(){
      if (event.which == 13 || event.keyCode == 13) {
        console.log("enter pressed")
        addLi(new_item_el.value)
        new_item_el.value = ''
        return false;
      }
      return true;
    }
  }

}

module.exports = basket
