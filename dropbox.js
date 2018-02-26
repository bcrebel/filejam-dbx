require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let pathToApp = '/Apps/filejam/'
let fs = require('fs')
let dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
let targetFiles = []

let populate = () => {
  let fakeProjects = [ "Wonder Woman\'s Gal Gadot", "Instagram Illusions" ]
  
//   function isFolder(file) {
//     let dateRegex = /[a-zA-Z]{3,9}\s+\d{1,2}/g
//     let posterRegex = /poster/ig
//     // console.log(file)
//     if( file['.tag'] != 'folder' ) {
//       return false
//     } else if(dateRegex.test(file.name) | posterRegex.test(file.name)) {
//       return false
//     } else {
//       return true
//     }
//   }
  
//   let getFiles = (path, condition) => {
//     return new Promise((resolve, reject) => {
      
//       let start = dbx.filesListFolder({ path: path, recursive: true, limit: 5 })
      
//       return build()
      
//       function pushFiles(entries) {
//         entries.forEach((file) => {
//           if(condition(file)) {
//             console.log(file.name)
//             targetFiles.push(file.name)
//           }
//         })
//       }
      
//       function cont(cursor) {
//         dbx.filesListFolderContinue({cursor}).then((result) => {
//           pushFiles(result.entries)
//           if(result.has_more) {
//             return cont(result.cursor)
//           } else {
//             resolve(targetFiles)
//           }
//         }).catch((error) => {
//           console.log(error)
//         })
//       }
      
//       function build() {
//         start.then((result) => {
//           pushFiles(result.entries)
          
//           if(result.has_more) {
//             return cont(result.cursor)
//           } else {
//             resolve(targetFiles)
//           }
//         }).catch((error) => {
//           console.log(error)
//         })
//       }
//     })
//   } 
  
//   getFiles('/STAMP/ELLE/Projects', isFolder)
//   .then((files) => {
//     console.log(files)
//   })
  return fakeProjects
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