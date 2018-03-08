// Next: TIMEOUT ON SERVER PROCESS, SEND TO CLIENT, THEN EXIT
const util = require('util')

require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')
const FileSync = require('lowdb/adapters/FileSync')
let brands = ["Cosmopolitan", "Elle", "Esquire", "Harpers Bazaar"]
let _ = require('lodash');

let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });


let populate = () => { 
  return brands
}

let upload = (body, files) => {
	let uploads = [];
	let links = [];
  let feed = {}

  feed[body.brand] = {};
  feed[body.brand][body.project] = { "slides": [] };
  feed[body.brand][body.project]["cover_card"] = body.coverCard;

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
									feed[body.brand][body.project]["slides"][idx]["poster"][uploads[idx]["name"]] = link.url
									console.log(uploads[idx].name)
									console.log(link.url)
								})

								files.canvasImage.forEach((file) => {
									fs.unlinkSync(file.path)
								})

								console.log(util.inspect(feed, { showHidden: true, depth: null }))

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

module.exports = { upload, populate }