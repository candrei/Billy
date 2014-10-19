var UI = require('ui');
var ajax = require('ajax');

var billingCode, hours;

var main = new UI.Card({
  title: 'Billy',
  subtitle: 'Easy, Accurate Billing',
  body: 'Press any button.'
});

var timer = 0;
var timerInterval, minutes;

var stop = function () {
  clearInterval(timerInterval);
};

var start = function () {
  stop();
  timerInterval = setInterval(function() {
    timer += 1/60;
    minuteVal = Math.floor(timer/60);
    console.log(minuteVal);
    minutes = minuteVal < 10 ? "0" + minuteVal.toString() : minuteVal;
  }, 1000/60);
};


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

var timeCaptureMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'START TIMER'
    }, {
      title: 'MANUAL ENTRY'
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
    }, {
      title: '3.75'
    }, {
      title: '3.50'
    }, {
      title: '3.25'
    }, {
      title: '3.00'
    }, {
      title: '2.75'
    }, {
      title: '2.50'
    }, {
      title: '2.25'
    }, {
      title: '2.00'
    }, {
      title: '1.75'
    }, {
      title: '1.50'
    }, {
      title: '1.25'
    }, {
      title: '1.00'
    }, {
      title: '0.75'
    }, {
      title: '0.50'
    }, {
      title: '0.25'
    }]
  }]
});

var timeCard = new UI.Card();
  timeCard.title('Timeheet');
  timeCard.subtitle('UPDATED!');

var recordingCard = new UI.Card();
  recordingCard.subtitle(' ');
  recordingCard.body('Tap to STOP timer');

timeCaptureMenu.on('select', function(e) {
  switch (e.item.title) {
    case 'START TIMER':
      start(timer);
      recordingCard.title(billingCode);
      recordingCard.show();
      return;
    default:
      hoursMenu.show();
  }
});

var minutesToHours = function (minutes) {
  if (minutes < 15) { return '0.25'; }
  if (minutes < 30) { return '0.50'; }
  if (minutes < 45) { return '0.75'; }
};

recordingCard.on('click', function(e) {
  stop();
  console.log(minutes);
  hours = minutesToHours(minutes);
  timeCard.body(billingCode + ': +' + hours);
  timeCard.show();
});

hoursMenu.on('select', function(e) {
  hours = e.item.title;
  var timeCard = new UI.Card();
  timeCard.body(billingCode + ': +' + hours);
  timeCard.show();
});

accountsMenu.on('select', function(e) {
  billingCode = e.item.title;
  timeCaptureMenu.show();
});

main.on('click', function(e) {
  accountsMenu.show();
});

main.show();
