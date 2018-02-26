require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')



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
    let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
    return dbx.filesUpload({contents: data, path:`${pathToApp + body.project}/${body.name.replace('mp4','jpg')}`, mode: 'overwrite'}) 
  }
}

module.exports = { upload }