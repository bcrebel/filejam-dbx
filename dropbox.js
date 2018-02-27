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
  let feed = {}
  feed[body.brand] = {}
  feed[body.brand][body.project] = {"slides": []}
  
  console.log(body.videoLink)
  console.log('files')  
  console.log(files)
  // console.log(util.inspect(feed, { showHidden: true, depth: null }))
  
  files.canvasImage.forEach((image, idx) => {
    doit(image, idx)
  })
  
  function doit(image, idx) {
    let poster = image.path;

    fs.readFile(poster, (err, data) => {
      send(data, image.originalname)
      .then((posterMetadata) => {
        // console.log(posterMetadata)
        // Add link to poster to feed

        createLink(posterMetadata.path_lower)
        .then((linkMetadata) => {
          // console.log(linkMetadata.url)
          let video = { video: {} }
          let poster = { poster: {} }
          video['video'][image.originalname] = body.videoLink[idx]
          poster['poster'][posterMetadata.name] = linkMetadata.url.replace('dl=0', 'dl=1')
          feed[body.brand][body.project]["slides"].push({})
          let slide = Object.assign({}, video, poster)
          // console.log('slide')
          // console.log(slide)

          feed[body.brand][body.project]["slides"][idx] = slide;
          console.log(util.inspect(feed, { showHidden: true, depth: null }))
        })
        .catch((error) => {
          if (error.status == 429) {
           setTimeout(function() { return doit(image, idx) }, 300000);
          }          
        })

        // Add link to video to feed
        // Delete local file
        fs.unlinkSync(poster)
      })
      .catch((error) => {
        console.log(error)     
      })
    })  
  }
  
  function send(data, name) {
    return dbx.filesUpload({contents: data, path:`${pathToApp + body.brand}/${body.project}/${name.replace('mp4','jpg')}`, mode: 'overwrite'})
  }
  
  function createLink(path) {
    return dbx.sharingCreateSharedLink({path: path})
  }
}

module.exports = { upload, populate }