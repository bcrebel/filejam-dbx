require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')



let upload = (body, files) => {
  let poster = files.poster[0].path
  console.log(files)
  let buff = Buffer.from(poster);
  console.log(buff)
  
  let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
  dbx.filesUpload({contents: buff, path:`${pathToApp + body.project}/${body.name}.jpg`, mode: 'overwrite'})
  .then((metadata) => { 
    console.log('metadata')
    console.log(metadata)
  })
  .catch((error) => {console.log(error)})

  // return dbx.filesUploadSessionStart({content: poster, path: `${pathToApp + body.project}/${body.name}.jpg`})
  // .then((response) => {
  //   console.log('here')
  //   dbx.filesUploadSessionFinish({ cursor: { "session_id": response.session_id, "offset": 0 }, content: poster })
  //   .catch((error) => { console.log(error)})
  // })
  // .catch((error) => {console.log(error)})
}

module.exports = { upload }