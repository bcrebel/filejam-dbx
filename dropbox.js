require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')



let upload = (body, files) => {
  // console.log('files')
  // console.log(files)
  // console.log(body)
  // console.log('body')
  let poster = files.canvasImage[0].path
  let buff = Buffer.from(poster);
  fs.readFile(poster, (err, data) => {
    doit(data)
    .then((metadata) => {
      console.log(metadata)
    })
    .catch((error) => {
      console.log(error)
    })
  })
  
  function doit(data) {
    let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
    return dbx.filesUpload({contents: data, path:`${pathToApp + body.project}/${body.name.replace('mp4','jpg')}`, mode: 'overwrite'}) 
  }
  
  // let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
  // dbx.filesUpload({contents: buff, path:`${pathToApp + body.project}/${body.name.replace('mp4','jpg')}`, mode: 'overwrite'})
  // .then((metadata) => { 
  //   console.log('metadata')
  //   console.log(metadata)
  // })
  // .catch((error) => {console.log(error)})

  // return dbx.filesUploadSessionStart({content: poster, path: `${pathToApp + body.project}/${body.name}.jpg`})
  // .then((response) => {
  //   console.log('here')
  //   dbx.filesUploadSessionFinish({ cursor: { "session_id": response.session_id, "offset": 0 }, content: poster })
  //   .catch((error) => { console.log(error)})
  // })
  // .catch((error) => {console.log(error)})
}

module.exports = { upload }