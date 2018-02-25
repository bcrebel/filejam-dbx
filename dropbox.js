require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'

let upload = (data) => {
  let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
  dbx.filesListFolder({path: pathToApp})
  .then((res) => { console.log(res) })
    dbx.filesUpload({content: data.payload, path: `${pathToApp}/${data.project}/poster1.jpg`})
    .then((metadata) => { 
      console.log(metadata)
    })
}

module.exports = { upload }