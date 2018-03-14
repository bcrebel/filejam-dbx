// server.js
// where your node app starts

// init project
require('dotenv').load();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

let { upload, populate, check, uploaded }  = require('./dropbox.js')

app.set('view engine', 'pug')

app.use(bodyParser.json({limit: '50mb', extended: true})); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
let multer = require('multer');
let load = multer({ dest: 'posters/' });

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  let brands = populate();
	response.render('index', { brands: brands })
});

app.post('/posters', load.fields([{ name: 'brand' }, { name: 'project' }, { name: 'canvasImage' } ]), function (request, response) {
	response.sendStatus(200);
	upload(request.body, request.files)
});


app.get('/session', function(request, response) {

	if(check() != false) {
		let stats = check()

		if(stats.mtimeMs > request.query.time) {
			response.send("feed updated")
		}
	} else {
		response.send("feed processing")
	}
})

app.get('/success', function(request, response) {
	let files = uploaded();
	response.render('success', { files: files })
})

// listen for requests :)
var listener = app.listen(8000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
