require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')
let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
let targetFiles = []

let populate = () => {
  let fakeProjects = [ "Wonder Woman\'s Gal Gadot", "Instagram Illusions" ]
  
  let getFiles = (path, condition) => {
    return new Promise((resolve, reject) => {
      
      let start = dbx.filesListFolder({ path: path, recursive: true, include_media_info: true, limit: 5 })
      
      return build()
      
      function pushFiles(entries) {
        entries.forEach((file) => {
          if(condition(file)) {
            targetFiles.push(file)
          }
        })
      }
      
      function cont(cursor) {
        dbx.filesListFolderContinue({cursor}).then((result) => {
          pushFiles(result.entries)
          if(result.has_more) {
            return cont(result.cursor)
          } else {
            resolve(targetFiles)
          }
        }).catch((error) => {
          console.log(error)
        })
      }
      
      function build() {
        start.then((result) => {
          pushFiles(result.entries)
          
          if(result.has_more) {
            return cont(result.cursor)
          } else {
            resolve(targetFiles)
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    })
  }  
}

let upload = (body, files) => {
  let poster = files.canvasImage[0].path
  fs.readFile(poster, (err, data) => {
    send(data)
    .then((metadata) => {
      console.log(metadata)
    })
    .catch((error) => {
      console.log(error)
    })
  })
  
  function send(data) {
    console.log(`${pathToApp + body.brand}/${body.project}/${body.name.replace('mp4','jpg')}`)
    return dbx.filesUpload({contents: data, path:`${pathToApp + body.brand}/${body.project}/${body.name.replace('mp4','jpg')}`, mode: 'overwrite'}) 
  }
}

module.exports = { upload, populate }