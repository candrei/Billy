var UI = require('ui');
var ajax = require('ajax');

var API_DB_URL = 'https://api.mongolab.com/api/1/databases/billy';
var API_KEY = '9fwz927kh0cPoD_YqdzMLGxZe1TGmYG9';

var billingCode, hours;

// Splash screen
var main = new UI.Card({
  title: 'Billy',
  subtitle: 'Easy, Accurate Billing',
  body: 'Press any button.'
});

// Retrieve avaialble accounts from MongoDB
var accounts;
ajax(
  {
    url: API_DB_URL + '/collections/projects?apiKey=' + API_KEY, 
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
  },
  function(error) {
    console.log('ajax failure: ' + JSON.stringify(error));
  }
);
console.log('items: ' + JSON.stringify(accounts));


function saveTime(code, mins) {
  
  var timesheet = {'code' : code, 'mins': mins, 'day': '2014-10-19'};
  
  ajax(
  {
    url: API_DB_URL + '/collections/timesheet?apiKey=' + API_KEY,  
    method: 'post',
    data: timesheet,
    type: 'json',
    async: false
  },
  function(result) {
    console.log('ajax success: ' + JSON.stringify(result));
  },
  function(error) {
    console.log('ajax failure: ' + JSON.stringify(error));
  }
);
}

function daySummary(day) {
   
  var aggregateQuery = {'aggregate' : 'timesheet', 'pipeline': [{'$group' : {_id : '$code', total: {'$sum' : '$mins'}}}]};

  var summary;

  var hourlyRate = 125;
  
  ajax(
  {
    url: API_DB_URL + '/runCommand?apiKey=' + API_KEY,
    method: 'post',
    data: aggregateQuery,
    type: 'json',
    async: false
  },
  function(result) {  
    var res = JSON.stringify(result.result)
    summary = JSON.parse(res, function(prop, value) {
      switch(prop) {
        case "_id":
          this.title = value;
          return;
		case "total":
		  this.subtitle = '$' + Math.round((value/60) * hourlyRate);
		  return;
        default:
          return value;
        }
    });
    
    console.log('ajax success: ' + JSON.stringify(summary));
  },
  function(error) {
    console.log('ajax failure: ' + JSON.stringify(error));
  }
);
  
  return summary;
}

var timer = 0;
var timerInterval, minutes;

var stop = function () {
  clearInterval(timerInterval);
};

var start = function () {
  stop();
  timer = 0;
  timerInterval = setInterval(function() {
    timer += 1;
    //console.log(timer);
  }, 1000);
};

var mainMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'RECORD TIME'
    }, {
      title: 'INVOICES'
    }]
  }]
});

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

var getDefaultHours = function () {
	var i = 8.00;
	var options = [];
	while (i) {
		options.push({title: i.toString()});
		i - 0.25;
	}
	return options;
}

var defaultHours = getDefaultHours();

var hoursMenu = new UI.Menu({
  sections: [{
    items: defaultHours
  }]
});

var invoicesMenu = new UI.Menu({
	sections: [{
		items: daySummary('2014-10-19')
	}]
});


var invoicesCard = new UI.Card();
  invoicesCard.title('Invoices');

var timeCard = new UI.Card();
  timeCard.title('Timeheet');
  timeCard.subtitle('UPDATED!');

var recordingCard = new UI.Card();
  recordingCard.subtitle(' ');
  recordingCard.body('Tap to STOP timer');

timeCaptureMenu.on('select', function(e) {
  switch (e.item.title) {
    case 'START TIMER':
      start();
      recordingCard.title(billingCode);
      recordingCard.show();
      return;
    default:
      hoursMenu.show();
  }
});

mainMenu.on('select', function(e) {
  switch (e.item.title) {
    case 'RECORD TIME':
      accountsMenu.show();
      return;
    case 'INVOICES':
		/*
      var summary = daySummary('2014-10-19'), entry, body = "";
      for( var i=0; i <summary.length; i++) {
        entry = summary[i];
        body += entry.title + ':\n' + entry.total + '\n\n';
      }
	*/
      //invoicesMenu.body(body);
      invoicesCard.show();
      return;
  }
});

timeCard.on('click', function() {
  accountsMenu.show();
});


var minutesToHours = function (minutes) {
  if (minutes < 15) { return '0.25'; }
  if (minutes < 30) { return '0.50'; }
  if (minutes < 45) { return '0.75'; }
};

recordingCard.on('click', function(e) {
  stop();
  saveTime(billingCode, timer);
  timeCard.body(billingCode + ': +' + timer + ' minutes');
  timeCard.show();
});

var hash = {
	'8.00': 480,
	'7.75': 465,
	'7.50': 450,
	'7.25': 435,
	'7.00': 420,
	'6.75': 405,
	'6.50': 390,
	'6.25': 375,
	'6.00': 360,
	'5.75': 345,
	'5.50': 330,
	'5.25': 315,
	'5.00': 300,
	'4.75': 285,
	'4.50': 270,
	'4.25': 255,
	'4.00': 240,
	'3.75': 225,
	'3.50': 210,
	'3.25': 195,
	'3.00': 180,
	'2.75': 165,
	'2.50': 150,
	'2.25': 135,
	'2.00': 120,
	'1.75': 105,
	'1.50': 90,
	'1.25': 75,
	'1.00': 60,
	'0.75': 45,
	'0.50': 30,
	'0.25': 15
};

hoursMenu.on('select', function(e) {
  hours = e.item.title;
  saveTime(billingCode, hash[hours]);
  timeCard.body(billingCode + ': +' + hash[hours] + ' minutes');
  timeCard.show();
});

accountsMenu.on('select', function(e) {
  billingCode = e.item.title;
  timeCaptureMenu.show();
});

main.on('click', function(e) {
  mainMenu.show();
});

main.show();
