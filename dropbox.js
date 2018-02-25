require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'

let upload = (data) => {
  let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

  dbx.filesUploadSessionStart({content: data.payload, path: `${pathToApp}/${data.project}/poster1.jpg`})
  .then((response) => {
    dbx.filesUploadSessionFinish({ cursor: { "session_id": response.session_id, "offset": 0 }, contents: data.payload })
    .catch((error) => { console.log(error)})
  })
  .catch((error) => {console.log(error)})
}

module.exports = { upload }