var UI = require('ui');
var ajax = require('ajax');
//var Vector2 = require('vector2');


var billingCode, hours;

var main = new UI.Card({
  title: 'Billy',
  subtitle: 'Easy, Accurate Billing',
  body: 'Press any button.'
});


var API_URL = 'https://api.mongolab.com/api/1/databases/billy/collections/projects';
var API_KEY = '9fwz927kh0cPoD_YqdzMLGxZe1TGmYG9';
var accounts;
ajax(
  {
    url: API_URL + '?apiKey=' + API_KEY, 
    method: 'get',
    async: false
  },
  function(result) {
    accounts = JSON.parse(result, function(prop, value) {
      switch(prop) {
        case "_id":
          this.title = value;
          return;
        case "label":
          this.subtitle = value;
          return;
        default:
          return value;
        }
    });
    //console.log('ajax success: ' + JSON.stringify(result));
  },
  function(error) {
    console.log('ajax failure: ' + JSON.stringify(error));
  }
);
console.log('items: ' + JSON.stringify(accounts));


var accountsMenu = new UI.Menu({
  sections: [{
    items: accounts
  }]
});

var hoursMenu = new UI.Menu({
  sections: [{
    items: [{
      title: '8.00'
    }, {
      title: '7.75'
    }, {
      title: '7.50'
    }, {
      title: '7.25'
    }, {
      title: '7.00'
    }, {
      title: '6.75'
    }, {
      title: '6.50'
    }, {
      title: '6.25'
    }, {
      title: '6.00'
    }, {
      title: '5.75'
    }, {
      title: '5.50'
    }, {
      title: '5.25'
    }, {
      title: '5.00'
    }, {
      title: '4.75'
    }, {
      title: '4.50'
    }, {
      title: '4.25'
    }, {
      title: '4.00'
    }]
  }]
});

hoursMenu.on('select', function(e) {
  hours = e.item.title;
  var card = new UI.Card();
  card.title(billingCode + ': +' + hours);
  card.body('Updating Timesheet...');
  card.show();
});

accountsMenu.on('select', function(e) {
  billingCode = e.item.title;
  hoursMenu.show();
});

main.on('click', function(e) {
  //sections should be dynamic
  accountsMenu.show();
});

main.show();
