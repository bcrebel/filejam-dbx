let videos, covers;

videoOptions = {

// Required. Called when a user selects an item in the Chooser.
	success: function(files) {
		let videoList = $("#video-list");
		videoList.empty();

		files.forEach((file) => {
			videoList
			.append(`<li><p>${file.name}</p><div style="background-image: url('${file.thumbnailLink}'); 
				background-size: contain; background-color: black; width: 42px; height: 75px;"></div></li>`);
			
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
				background-size: contain; width: 87px; height: 116px;"></div></li>`);  

			covers = files

			if(validation.hasAll() && videos != undefined) validation.toggleDisabledAttr($("button"));

		});
	},
	linkType: "direct",
	multiselect: false, 
	extensions: ['.jpg', '.png'],
	folderselect: false
};

file = {
	name: "filename.txt",
	link: "https://...",
	thumbnailLink: "https://...?bounding_box=75&mode=fit"
};

var coverButton = Dropbox.createChooseButton(coverOptions);
document.getElementById("cover").appendChild(coverButton);
// $(coverButton).addClass("disabled")

var videoButton = Dropbox.createChooseButton(videoOptions);
document.getElementById("videos").appendChild(videoButton);
// $(videoButton).addClass("disabled")
