// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let { upload }  = require('./dropbox.js')

app.use(bodyParser.json({limit: '50mb', extended: true})); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/posters", function (request, response) {
  // console.log(request.body)
  upload(request.body)
  response.sendStatus(200);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
