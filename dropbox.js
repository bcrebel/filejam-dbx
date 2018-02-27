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
  
  function process() {
      files.canvasImage.forEach((image, idx, arr) => {
        doit(image, idx, arr)
      })
  }

  process()


  
  function doit(image, idx, arr) {
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
          if(linkMetadata) {
            let video = { video: {} }
            let poster = { poster: {} }
            video['video'][image.originalname] = body.videoLink[idx]
            poster['poster'][posterMetadata.name] = linkMetadata.url.replace('dl=0', 'dl=1')
            feed[body.brand][body.project]["slides"].push({})
            let slide = Object.assign({}, video, poster)
            console.log('video')
            console.log(video)

            feed[body.brand][body.project]["slides"][idx] = slide;
            _.remove(feed[body.brand][body.project]["slides"], _.isEmpty)

            console.log(util.inspect(feed, { showHidden: true, depth: null }))
          }
        })

          // Delete local file
          fs.unlinkSync(poster)
        }
      })
      .catch((error) => {
        console.log('lower error')
        console.log(error)     
      })
      
    }) 
    
  }
  
  function send(data, name) {
    return dbx.filesUpload({contents: data, path:`${pathToApp + body.brand}/${body.project}/${name.replace('mp4','jpg')}`, mode: 'overwrite'})
    .catch((error) => {
      console.log(error.error)
      if (error.status == 429) {
        console.log('from error.status')
        setTimeout(function() { return send(data, name) }, 300000);
      }          
    })
  }
  
  function createLink(path) {
    return dbx.sharingCreateSharedLink({path: path})
  }
}

module.exports = { upload, populate }