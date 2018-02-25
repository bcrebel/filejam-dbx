require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;

let upload = (data) => {
  let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
  dbx.filesUpload({content: data.payload, path: `${new/data.project}/poster1.jpg`})
  .then((metadata) => { 
    console.log(metadata)
  })
}

module.exports = { upload }