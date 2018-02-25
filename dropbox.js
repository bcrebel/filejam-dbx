require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')



let upload = (body, files) => {
  let poster = files.poster[0].path
  
  function getBuffer(poster) {
    let decodedImage = null
    return fs.readFileSync(poster, function(err, data) {
      console.log('happened at all')
      if (err) {console.log(err)}

      // Encode to base64
      var encodedImage = new Buffer(data, 'binary').toString('base64');

      // Decode from base64
      decodedImage = new Buffer(encodedImage, 'base64').toString('binary');
      console.log('decodedImage')
      console.log(decodedImage)
      return decodedImage
    });
  }
  
  let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
  dbx.filesUpload({content: getBuffer(poster), path:`${pathToApp + body.project}/${body.name}.jpg`, mode: 'overwrite'})
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