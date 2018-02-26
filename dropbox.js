const util = require('util')

require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')
const FileSync = require('lowdb/adapters/FileSync')
let brands = ["Cosmopolitan", "Elle", "Esquire", "Harpers Bazaar"]

let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
let targetFiles = []

let populate = () => {


  
  return brands
}

let upload = (body, files) => {
  let poster = files.canvasImage[0].path;
  let feed = {}
  feed[body.brand] = {}
  feed[body.brand][body.project] = {"slides": []}
  
  
  console.log(util.inspect(feed, { showHidden: true, depth: null }))
  
  fs.readFile(poster, (err, data) => {
    send(data)
    .then((posterMetadata) => {
      console.log(metadata)
      // Add link to poster to feed

      createLink(metadata.path_lower)
      .then((linkMetadata) => {
        console.log(metadata.url)
        let video = {}
        let poster = {}
        video[body.name] = body.videoLink
        poster[mea] = 
        feed[body.brand][body.project]["slides"].push(video)

      })
      .catch((error) => {
        console.log(error)
      })
      
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
  
  function createLink(path) {
    return dbx.sharingCreateSharedLink({path: path})
  }
}

module.exports = { upload, populate }