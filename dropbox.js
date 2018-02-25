require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'

let upload = (data) => {
  let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

  dbx.filesUpload({content: data.payload, path: `${pathToApp}/${data.project}/poster1.jpg`})
  .then((metadata) => { 
    console.log(metadata)
  })
  .catch((error) => {
    console.log(error)
  })
}

module.exports = { upload }