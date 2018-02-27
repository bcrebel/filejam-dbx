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
  
   
  files.canvasImage.forEach((image, idx) => {
    doit(image, idx)
  })
  console.log('final')
  console.log(util.inspect(feed, { showHidden: true, depth: null }))

  
  function doit(image, idx) {
    let poster = image.path;

    fs.readFile(poster, (err, data) => {
      send(data, image.originalname)
      
        .then((posterMetadata) => {
        if(posterMetadata == undefined) { 
          // console.log('no poster made')
          return doit(image, idx)  
        } else if (posterMetadata) {
            createLink(posterMetadata.path_lower)

          .then((linkMetadata) => {
            let video = { video: {} }
            let poster = { poster: {} }
            video['video'][image.originalname] = body.videoLink[idx]
            poster['poster'][posterMetadata.name] = linkMetadata.url.replace('dl=0', 'dl=1')
            feed[body.brand][body.project]["slides"].push({})
            let slide = Object.assign({}, video, poster)
            console.log('video')
            console.log(video)

            feed[body.brand][body.project]["slides"][idx] = slide;
            console.log(util.inspect(feed, { showHidden: true, depth: null }))
          })


          // Add link to video to feed
          // Delete local file
          fs.unlinkSync(poster)
        }
      })
      .catch((error) => {
        console.log(error)     
      })
      
    })  
  }
  
  function send(data, name) {
    return dbx.filesUpload({contents: data, path:`${pathToApp + body.brand}/${body.project}/${name.replace('mp4','jpg')}`, mode: 'overwrite'})
    .catch((error) => {
      console.log(error)
      if (error.status == 429) {
        setTimeout(function() { return doit(data, name) }, 300000);
      }          
    })
  }
  
  function createLink(path) {
    return dbx.sharingCreateSharedLink({path: path})
  }
}

module.exports = { upload, populate }