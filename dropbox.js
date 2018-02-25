require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')



let upload = (body, files) => {
  let poster = fs.readFileSync(files.poster[0].path)
  console.log(files.poster[0].path)
  let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
  dbx.filesUpload({content: poster, path:`${pathToApp + body.project}/${body.name}.jpg`})
  .then((metadata) => { console.log(metadata)})
  .catch((error) => {console.log(error)})

  // dbx.filesUploadSessionStart({content: data.poster, path: `${pathToApp}/${data.project}/poster1.jpg`})
  // .then((response) => {
  //   dbx.filesUploadSessionFinish({ cursor: { "session_id": response.session_id, "offset": 0 }, contents: data.poster })
  //   .catch((error) => { console.log(error)})
  // })
  // .catch((error) => {console.log(error)})
}

module.exports = { upload }