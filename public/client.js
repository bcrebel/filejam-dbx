      let brands = []
      let brand = '';
      let projectName = '';
      let fileName = '';
      let videos = [];
 
      function dataURItoBlob(dataURI) {
          // convert base64/URLEncoded data component to raw binary data held in a string
          var byteString;
          if (dataURI.split(',')[0].indexOf('base64') >= 0)
              byteString = atob(dataURI.split(',')[1]);
          else
              byteString = unescape(dataURI.split(',')[1]);

          // separate out the mime component
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

          // write the bytes of the string to a typed array
          var ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }

          return new Blob([ia], {type:mimeString});
      }

      function syncMe() {
        function getVideoImage(path, secs, callback) {
          var me = this, video = document.createElement('video');
          video.crossOrigin = "Anonymous";

          video.onloadedmetadata = function() {
            if ('function' === typeof secs) {
              secs = secs(this.duration);
            }
            
            this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
          };
          
          video.onseeked = function(e) {
            var canvas = document.createElement('canvas');
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            var img = new Image();
            img.src = canvas.toDataURL('image/jpeg', 1.0);
            
            callback.call(me, img, this.currentTime, e);
          };
          
          video.onerror = function(e) {
            callback.call(me, undefined, undefined, e);
          };
          
          video.src = path;
        }
        
        // Declare values from selects here
        brand = $( "#brand" ).val();
        projectName = $( "#projects" ).val();
        let fd = new FormData(document.forms[0]);


        videos.forEach((video) => { 
          fileName = video.name


          getVideoImage(video.link,
            function() {
              return 0;
            },
                 
            function(img, secs, event) {
              var blob = dataURItoBlob(img.src);

              fd.set("brand", brand)
              fd.set("project", projectName);
              fd.append("name", video.name); 
              console.log('video.name')
              console.log(video.name)
              fd.append("canvasImage", blob);
              fd.append("videoLink", video.link); // You'll need to change this to be an index
            }           
          )          
        })
        
        $.ajax({
          url : "/posters",
          type: "POST",
          cache: false,
          async: false,
          processData: false,
          contentType: false,
          data: fd,
          success: function(data) {
            console.log(data); // 'OK'
          }
        })
      }
    
      
      videoOptions = {

        // Required. Called when a user selects an item in the Chooser.
        success: function(files) {
            files.forEach((file) => {
              var node = document.createElement("li");                 
              var textnode = document.createTextNode(`${file.name}`);
              node.appendChild(textnode);                              
              document.getElementById("video-list").appendChild(node); 
              
              videos = files
            });
          
        },

        // Optional. Called when the user closes the dialog without selecting a file
        // and does not include any parameters.
        cancel: function() {

        },
        
        linkType: "direct",
        multiselect: true, 
        extensions: ['.mp4'],
        folderselect: false, // or true
      };
      
      file = {
       // Unique ID for the file, compatible with Dropbox API v2.
        id: "id:...",

        // Name of the file.
        name: "filename.txt",

        link: "https://...",

        // Size of the file in bytes.
        bytes: 464,

        // URL to a 64x64px icon for the file based on the file's extension.
        icon: "https://..."
      };
      console.log(brands)
      var videoButton = Dropbox.createChooseButton(videoOptions);
      document.getElementById("videos").appendChild(videoButton);

