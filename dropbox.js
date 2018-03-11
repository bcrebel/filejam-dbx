// Next: TIMEOUT ON SERVER PROCESS, SEND TO CLIENT, THEN EXIT
const util = require('util')

require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
const fs = require('fs');
const jsonFormat = require('json-format');
const StringDecoder = require('string_decoder').StringDecoder;

let pathToApp = '/Apps/filejam/';
let brands = ["Cosmopolitan", "Elle", "Esquire", "Harpers Bazaar"];
let _ = require('lodash');

let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

let populate = () => { 
  return brands
}
 
let feed, brand, project;


let upload = (body, files) => {
	console.log('initial feed')
	console.log(feed)
	let uploads = [];
	let links = [];
	feed = {};
	brand = body.brand;
	project = body.project;

  feed[brand] = {};
  feed[brand][project] = { "slides": [] };
  feed[brand][project]["cover_card"] = body.coverCard;

  if(!_.isArray(body.link)) { 

  	let arr = []
  	arr.push(body.link)
  	body.link = arr
	}


	body.link = body.link.map((link, idx, acc) => {
		let obj = {};
		 obj["filename"] = link.slice(link.lastIndexOf("/") + 1)
			obj["url"] = link
		return obj
	}, [])

	body.link = _.sortBy(body.link, "filename");

  body.link.forEach((link, idx) => {
  	var slide = { "video": {} }
		slide["video"][link.filename] = link.url;

  	feed[body.brand][body.project]["slides"][idx] = slide
  	feed[body.brand][body.project]["slides"][idx]["poster"] = {}
	})

  let api = {
		read: function(file, link) {
			return new Promise((resolve, reject) => {
				fs.readFile(file.path, (error, data)  => {
					if(error) reject(error)
					let record = {};
					record[file.originalname] = {};
					record[file.originalname] = data;
					resolve(record);
				})
			})
		},

  	send: function(data, name, length) {
			return dbx.filesUpload({contents: data, path:`${pathToApp + body.brand}/${body.project}/${name.replace('mp4','jpg')}`, mode: 'overwrite'})
			.then((metadata) => {
				let filename = metadata.name;
				let path = metadata.path_lower;

				uploads.push(metadata)

				if(uploads.length == length) {
					
					// order them
					uploads = _.sortBy(uploads, "name");

					uploads.forEach((upload, idx) => {

						api.createLink(upload.path_lower)
						.then((link) => {
							link.url = link.url.replace('dl=0', 'dl=1')
							links.push(link)
							if(links.length == length) {
								links = _.sortBy(links, "path");

								links.forEach((link, idx) => {
									feed[body.brand][body.project]["slides"][idx]["poster"][uploads[idx]["name"]] = link.url;
								})

								files.canvasImage.forEach((file) => {
									fs.unlinkSync(file.path)
								})

								write.feed();
								// console.log(util.inspect(feed, { showHidden: true, depth: null }))
							}
						})
						.catch((error) => {
							console.log(error)
						})
					})
				}
			})
			.catch((error) => {
				console.log(error.error)
				if(error.status == 429) {  return api.send(data, name, length) }
			})
		},

		createLink: function(path) {
			return dbx.sharingCreateSharedLink({path: path})
			.catch((error) => {
				console.log(error.error)
				if(error) { setTimeout(function() { return api.createLink(path) }, 3000 ) }
			})
		}
  }

  let write = {
		feed: function() {
			if(fs.existsSync("feed.json")) {
				fs.readFile("feed.json", (error, data) => {
					if(error) reject(error);

					let decoder = new StringDecoder('utf8');
					let oldFeed = JSON.parse(decoder.write(data));
					console.log('later feed')
					console.log(feed)
					console.log(oldFeed)
					feed = _.assign({}, oldFeed, feed);

					write.file(jsonFormat(feed));
					console.log('done')
				});
			} else {
				write.file(jsonFormat(feed));
			}
		},

		file: function(data) {
			fs.writeFileSync("feed.json", data, (error) => {
				if(error) throw error;
				console.log("Feed has been saved");
			})
		}
  }


  function doit() {
  	let posters = files.canvasImage.map((file, idx) => {
  		return api.read(file, body.link[idx])
  	})

		Promise.all(posters)
		.then((records) => {
			records.forEach((record) => {
				length = records.length;
				let filename = Object.keys(record)[0]
				let buff = record[filename]

				api.send(buff, filename, length)
			})
		})
		.catch((error) => {
			console.log(error)
		})
	}

  doit()
}

let check = () => {

	if(fs.existsSync("feed.json")) {
		return fs.statSync('feed.json')
	} else {
		return false;
	}
}

let uploaded = () => {

	let slides = feed[brand][project]["slides"].map((slide) => {
		return _.keys(slide.video)[0]
	})

	return { slides }
}


module.exports = { upload, populate, check, uploaded }
