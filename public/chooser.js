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

var videoButton = Dropbox.createChooseButton(videoOptions);
document.getElementById("videos").appendChild(videoButton);