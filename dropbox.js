require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')
const FileSync = require('lowdb/adapters/FileSync')
let brands = ["Cosmopolitan", "Elle", "Esquire", "Harpers Bazaar"]

// let  feed = brands.reduce((acc, curr) => {
//           acc[curr] = {}
//           return acc
//         }, {})
//   console.log(feed)

let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
let targetFiles = []

let populate = () => {


  
  return brands
}

let upload = (body, files) => {
  let poster = files.canvasImage[0].path
  
  let feed = { body.brand: {} }
  feed[body.brand][body.project] = {"slides": []}
  console.log(feed)
  
  fs.readFile(poster, (err, data) => {
    send(data)
    .then((metadata) => {
      console.log(metadata)
      // Add link to poster to feed
      // Add link to video to feed
      // Delete local file
      fs.unlinkSync(poster)
    })
    .catch((error) => {
      console.log(error)
    })
  })
  
  function send(data) {
    return dbx.filesUpload({contents: data, path:`${pathToApp + body.brand}/${body.project}/${body.name.replace('mp4','jpg')}`, mode: 'overwrite'})
  }
}

module.exports = { upload, populate }