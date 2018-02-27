// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let { upload, populate }  = require('./dropbox.js')

app.set('view engine', 'pug')

app.use(bodyParser.json({limit: '50mb', extended: true})); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
let multer = require('multer');
let load = multer({ dest: 'posters/' });

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  let brands = populate()
  response.render('index', { brands: brands })

});

app.post("/posters", load.fields([{ name: 'brand' }, { name: 'project' }, { name: 'name'}, { name: 'canvasImage' } ]), function (request, response) {
  upload(request.body, request.files)
  response.sendStatus(200);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
