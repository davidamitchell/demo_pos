var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var collection = [
  {'name':'bob'},
  {'name':'bob'},
  {'name':'john'},
  ];

  res.render('index', {
    data: {
      title: 'basket',
      basket_list: collection
    }
  });
});

module.exports = router;
