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

let populate = () => { 
  return brands
}

let upload = (body, files) => {
  let feed = {}
  feed[body.brand] = {}
  feed[body.brand][body.project] = {"slides": []}

  let api = {
		read: function(file, link) {
			return new Promise((resolve, reject) => {
				fs.readFile(file.path, (error, data)  => {
					if(error) reject(error)
					let record = {}
					record[file.originalname] = {}
					record[file.originalname]['data'] = data
					record[file.originalname]['link'] = link

					resolve(record)
				})
			})
  	},

  	send: function(data, name) {
 			return dbx.filesUpload({contents: data, path:`${pathToApp + body.brand}/${body.project}/${name.replace('mp4','jpg')}`, mode: 'overwrite'})
			.catch((error) => {
				console.log(error.error)
				if (error.status == 429) {
					console.log('from error.status')
					setTimeout(function() { return send(data, name) }, 300000);
				}
			})
  	}
  }


  function doit() {
  	let posters = files.canvasImage.map((file, idx) => {
  		return api.read(file, body.link[idx])
  	})

		Promise.all(posters)
		.then((records) => {
			console.log(records)
		})
		.catch((error) => {
			console.log(error)
		})
	}

	console.log(body)
  console.log('length of files')
  console.log(files.canvasImage.length)
  doit()
}

module.exports = { upload, populate }