const util = require('util')

require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')
const FileSync = require('lowdb/adapters/FileSync')
let brands = ["Cosmopolitan", "Elle", "Esquire", "Harpers Bazaar"]
let _ = require('lodash');

let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

let targetFiles = []
let uploads = [];
let links = [];

let populate = () => { 
  return brands
}

let upload = (body, files) => {
  let feed = {}
  feed[body.brand] = {}
  feed[body.brand][body.project] = {"slides": []}

  console.log('!_.isArray(body.link')

  console.log(!_.isArray(body.link))
  if(!_.isArray(body.link)) { 
  	  	console.log(body.link)

  	let arr = []
  	arr.push(body.link)
  	body.link = arr
	}

  body.link.forEach((link, idx) => {
  	var slide = { "video": {} }
		slide["video"][files.canvasImage[idx].originalname] = link

  	feed[body.brand][body.project]["slides"][idx] = slide
  	feed[body.brand][body.project]["slides"][idx]["poster"] = {}
		})


  let api = {
		read: function(file, link) {
			return new Promise((resolve, reject) => {
				fs.readFile(file.path, (error, data)  => {
					if(error) reject(error)
					let record = {}
					record[file.originalname] = {};
					record[file.originalname] = data;

					fs.unlinkSync(file.path);
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
					// console.log(uploads) 

					uploads.forEach((upload, idx) => {
						// feed[body.brand][body.project]["slides"][idx]["poster"] = {}
						// feed[body.brand][body.project]["slides"][idx]["poster"][upload.name] = ""
						api.createLink(upload.path_lower)
						.then((link) => {
							link.url = link.url.replace('dl=0', 'dl=1')
							links.push(link)
							if(links.length == length) {
								links = _.sortBy(links, "path")

								links.forEach((link, idx) => {
									feed[body.brand][body.project]["slides"][idx]["poster"][uploads[idx]["name"]] = link.url
									console.log(uploads[idx])
									console.log(link)
								})
								// console.log(links)
								console.log(util.inspect(feed, { showHidden: true, depth: null }))
							}
						})
					})
				}
			})
			.catch((error) => {
				console.log(error.error)
				setTimeout(function() { 
					console.log('this')
					return api.send(data, name, length) 
				}, 6000);
			})
		},

		createLink: function(path) {
			return dbx.sharingCreateSharedLink({path: path})
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

	// console.log(body)
 //  console.log('length of files')
 //  console.log(files.canvasImage.length)
  doit()
}

module.exports = { upload, populate }