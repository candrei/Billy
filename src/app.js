var UI = require('ui');
//var Vector2 = require('vector2');

var billingCode, hours;

var main = new UI.Card({
  title: 'Billy',
  subtitle: 'Easy, Accurate Billing',
  body: 'Press any button.'
});

var accountsMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'C201-004',
      subtitle: 'AirForce Dashboard'
    }, {
      title: 'A345-004',
      subtitle: 'Veteran Affairs Proj'
    }, {
      title: 'N565-004',
      subtitle: 'Navy Recruitment'
    }, {
      title: 'M322-004',
      subtitle: 'Marines Game'
    }]
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
