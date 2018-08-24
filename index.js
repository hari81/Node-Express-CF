// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var authenticateOutput = require('./responses/authenticate/output.json');
var authenticateInput = require('./responses/authenticate/input.json');

var getUserDetailsOutput = require('./responses/getuserdetails/output.json');

var mobileApiTestJson = require('./responses/getuserdetails/mobileapitest.json')
var mobileApiTest2Json = require('./responses/getuserdetails/mobileapitest2.json')
var mobileApiTest3Json = require('./responses/getuserdetails/mobileapitest3.json')
var mobileApp2 = require('./responses/getuserdetails/mobileapp2.json')

// Moustache
var mustacheExpress = require('mustache-express');
// Register '.mustache' extension with The Mustache Express
app.engine('html', mustacheExpress());

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public')); // set static folder

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var i = 0;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

var endPoints = [
  {
    "url": "identities/authenticate",
    "output": authenticateOutput,
    "outputJson":JSON.stringify(authenticateOutput),
    "postInput": authenticateInput,
    "inputJSON": JSON.stringify(authenticateInput),
    "method": "post"
  },
  {
    "url": "api/getuserdetails/autovspdriverdev@customfleet.com.au",
    "output": getUserDetailsOutput,
    "outputJson":JSON.stringify(getUserDetailsOutput),
    "method": "get"
  },
  {
    "url": "api/getuserdetails/mobileapitest@customfleet.com.au",
    "output": mobileApiTestJson,
    "outputJson":JSON.stringify(mobileApiTestJson),
    "method": "get"
  },
  {
    "url": "api/getuserdetails/mobileapitest2@customfleet.com.au",
    "output": mobileApiTest2Json,
    "outputJson":JSON.stringify(mobileApiTest2Json),
    "method": "get"
  },
  {
    "url": "api/getuserdetails/",
    "output": mobileApp2,
    "outputJson":JSON.stringify(mobileApp2),
    "method": "get"
  },
];

endPoints.forEach(function(element) {
  router.all('/'+element["url"], function(req, res) {
    res.json(element["output"]);
  });
});

// more routes for our API will happen here

app.get('/', function(req, res) {
  res.render('index', {
    head: {
      title: 'CF Mock Server'
    },
    content: {
      title: 'CF Mock Server',
      description: endPoints
    }
  });
});



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/mobileservice', router);

app.get('/increment', function(req, res) {
  i++;
  res.json({i});
});

// app.get('/mobileservice/api/getuserdetails/autovspdriverdev@customfleet.com.au', function(req, res) {
//   res.json(getUserDetailsOutput);
// });

app.use(function (req, res, next) {
  res.status(404).json({
    error: "Sorry can't find that!"
  })
})

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
