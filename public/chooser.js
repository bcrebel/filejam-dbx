let videos, covers;
let assetList = $("#asset-list");

videoOptions = {

// Required. Called when a user selects an item in the Chooser.
	success: function(files) {
		$(".eight.columns").css({"border": "0"});
		$(".video-item").remove();

		files.forEach((file, idx) => {
			// strip off the existing query parameters
			var baseThumbnail = file.thumbnailLink.split('?')[0];
			 
			// add "?mode=crop&bounding_box=800"
			var cropped = baseThumbnail + '?' + $.param({ mode: 'fit', bounding_box: 256 });

			assetList
			.append(`<li class="video-item"><p class='label'>Video #${idx + 1}</p><p>${file.name}</p><div style="background-image: url('${cropped}'); 
				background-size: cover; width: 37.5px; height: 66.6px;"></div></li>`);
			
			videos = files;

			if(validation.hasMeta() && covers != undefined) validation.toggleDisabledAttr($("button"));
		});
	},

	linkType: "direct",
	multiselect: true, 
	extensions: ['.mp4'],
	folderselect: false
};

coverOptions = {

	success: function(files) {
		$(".eight.columns").css({"border": "0"});
		$(".cover-item").remove();

		files.forEach((file) => {
			assetList
			.prepend(`<li class="cover-item"><p class='label'>Cover Card</p><p>${file.name}</p><div style="background-image: url('${file.link}');
				background-size: cover; width: 58px; height: 77.2px;"></div></li>`);  

			covers = files

			if(validation.hasMeta() && videos != undefined) validation.toggleDisabledAttr($("button"));
		});
	},
	linkType: "direct",
	multiselect: false, 
	extensions: ['.jpg', '.png'],
	folderselect: false
};


var coverButton = Dropbox.createChooseButton(coverOptions);
document.getElementById("cover").appendChild(coverButton);

var videoButton = Dropbox.createChooseButton(videoOptions);
document.getElementById("videos").appendChild(videoButton);
