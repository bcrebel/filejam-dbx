videoOptions = {

// Required. Called when a user selects an item in the Chooser.
	success: function(files) {
		files.forEach((file) => {
			var node = document.createElement("li");                 
			var textnode = document.createTextNode(`${file.name}`);
			node.appendChild(textnode);   
			validation.toggleDisabledAttr($("button"))                      
			document.getElementById("video-list").appendChild(node); 

		videos = files
		});
	},

	linkType: "direct",
	multiselect: true, 
	extensions: ['.mp4'],
	folderselect: false, // or true
};

coverOptions = {

// Required. Called when a user selects an item in the Chooser.
	success: function(files) {
		files.forEach((file) => {
			var node = document.createElement("li");                 
			var textnode = document.createTextNode(`${file.name}`);
			node.appendChild(textnode);    
			validation.toggleDisabledClass($(videoButton))     
			document.getElementById("cover-list").appendChild(node); 

		covers = files
		});
	},
	linkType: "direct",
	multiselect: false, 
	extensions: ['.jpg', '.png'],
	folderselect: false
};

file = {
	name: "filename.txt",
	link: "https://..."
};

var coverButton = Dropbox.createChooseButton(coverOptions);
document.getElementById("cover").appendChild(coverButton);
$( coverButton ).addClass("disabled")

var videoButton = Dropbox.createChooseButton(videoOptions);
document.getElementById("videos").appendChild(videoButton);
$( videoButton ).addClass("disabled")
