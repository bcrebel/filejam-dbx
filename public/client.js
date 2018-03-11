 
let createPosters = {
	
	getVideoImage: function(path, secs) {
		return new Promise((resolve, reject) => {

			var me = this, video = document.createElement('video');
			video.crossOrigin = 'Anonymous'; // Bump tainted canvases

			video.onloadedmetadata = function() {
				console.log('metadata loaded')
				this.currentTime = secs;
			}

			video.onseeked = function(e) {
				console.log('video seeked')

				let canvas = document.createElement('canvas');
				canvas.height = video.videoHeight;
				canvas.width = video.videoWidth;

				let ctx = canvas.getContext('2d');
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

				let img = new Image();
				img.src = canvas.toDataURL('image/jpeg', 1.0);	
				resolve(img.src)
			}

			video.onerror = function(e) {
	    	reject(video.error.message)
	  	};

			video.src = path
		})
	},

	convertToBlob: function(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    console.log('converting to blob')
		return new Promise ((resolve, reject) => {
			var byteString;

			if (dataURI.split(',')[0].indexOf('base64') >= 0) {
				byteString = atob(dataURI.split(',')[1]);
			} else {
				byteString = unescape(dataURI.split(',')[1]);
			}

			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

			// write the bytes of the string to a typed array
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
			  ia[i] = byteString.charCodeAt(i);
			}

			resolve( new Blob([ia], {type:mimeString}) )
		})
	}
}

// sendPosters.checkStatus();


let sendPosters = {
	
	addToForm: function(form, field, content, name = null) {
		if (name) { 
			form.append(field, content, name);
		} else {
			form.append(field, content);
		}
	},
	
	sendForm: function(form) {
		console.log('sending blobs')

		return $.ajax({
  		url : "/posters",
			type: "POST",
			cache: false,
			processData: false,
			contentType: false,
			data: form,
			timeout: 5000,
			retryLimit : 5,
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown)
				console.log(jqXHR)
				console.log(textStatus)

				if (textStatus == 'timeout') {
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						//try again
						$.ajax(this);
						return;
					}
					return;
				}
			},
			
			success: function(data) {
				console.log(data); // 'OK'
			}
		})
	},

	checkStatus: function() {
		let limit = 12;
		let start = 0;
		let startTime = Date.now();
				
		let feedInt = setInterval(visitFeed, 1000)

		function visitFeed() {
					console.log('start is')

			start++;
			$.get( "/session",  { "time": startTime }, (data) => {
				console.log(data)

				if(data === "feed updated") {
					location.href = "success";
					clearInterval(feedInt)

				}
			});

			if(start === limit) {
				console.log('here')
				$("#overlay p").remove()
				$("#overlay").append("<p class='sorry'>Something went wrong</p>")

				$("#overlay").append("<div class='error-buttons'><button id='back'>Try Again</button><button id='cancel'>cancel</button></div>")

				$( "#back" ).click(function() {
				  $("#overlay").remove()
				  process()
				});

				$("#cancel").click(function() {
					location.reload()
				});

				console.log('try again')
				clearInterval(feedInt)

			}
		}

	}
}

let validation = {

	toggleDisabledAttr: function(element) {
		element.removeAttr('disabled')
	},
 	
 	toggleDisabledClass: function(element) {
		element.removeClass('disabled')
	},

	hasBrand: function(brand) {
		if (brand.val() != '') {
			validation.toggleDisabledAttr($('#projects'))
		} 
	},

	hasProject: function(project) {
		if( project.val() != '') {
			validation.toggleDisabledClass($(coverButton))
		}
	}
}



function process() {

	$("body").append("<div id='overlay'><p>Processing...</p></div>")
	sendPosters.checkStatus();

	let brand = $( "#brand" ).val();
	let projectName = $( "#projects" ).val();
	let fd = new FormData(document.forms[0]);
		fd.set("brand", brand)
		fd.set("project", projectName);

	let coverCards = covers.forEach((cover) => {
		sendPosters.addToForm(fd, "coverCard", cover.link)
	})

	let posters = videos.map((video) => { 
	 	return createPosters.getVideoImage(video.link, 0)
	})

	Promise.all(posters)
	.then((posters) => {
		let blobs = posters.map((blob) => {
			return createPosters.convertToBlob(blob)
		})

		Promise.all(blobs)
		.then((blobs) => {
			blobs.forEach((blob, idx) => {
				sendPosters.addToForm(fd, "canvasImage", blob, videos[idx].name)
				sendPosters.addToForm(fd, "link", videos[idx].link)
			})

			sendPosters.sendForm(fd)
		})
	})
	.catch((error) => {
		console.log(error)
	})
}