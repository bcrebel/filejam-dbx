let videos, covers;

videoOptions = {

// Required. Called when a user selects an item in the Chooser.
	success: function(files) {
		let videoList = $("#video-list");
		videoList.empty();

		files.forEach((file) => {
						// strip off the existing query parameters
			var baseThumbnail = file.thumbnailLink.split('?')[0];
			 
			// add "?mode=crop&bounding_box=800"
			var cropped = baseThumbnail + '?' + $.param({ mode: 'fit', bounding_box: 256 });

			videoList
			.append(`<li><p>${file.name}</p><div style="background-image: url('${cropped}'); 
				background-size: cover; width: 128px; height: 128px;"></div></li>`);
			
			videos = files;

			if(validation.hasAll() && covers != undefined) validation.toggleDisabledAttr($("button"));
		});
	},

	linkType: "direct",
	multiselect: true, 
	extensions: ['.mp4'],
	folderselect: false
};

coverOptions = {

// Required. Called when a user selects an item in the Chooser.
	success: function(files) {
		let coverList = $("#cover-list")
		coverList.empty()

		files.forEach((file) => {
			coverList
			.append(`<li><p>${file.name}</p><div style="background-image: url('${file.link}');
				background-size: cover; width: 128px; height: 128px;"></div></li>`);  

			covers = files

			if(validation.hasAll() && videos != undefined) validation.toggleDisabledAttr($("button"));

		});
	},
	linkType: "direct",
	multiselect: false, 
	extensions: ['.jpg', '.png'],
	folderselect: false
};

// file = {
// 	name: "filename.txt",
// 	link: "https://...",
// 	thumbnailLink: "https://...?bounding_box=256&mode=fit_one_and_overflow"
// };

var coverButton = Dropbox.createChooseButton(coverOptions);
document.getElementById("cover").appendChild(coverButton);

var videoButton = Dropbox.createChooseButton(videoOptions);
document.getElementById("videos").appendChild(videoButton);
