/* Create private Gist with draft content on GitHub
*. When first run, you will be prompted for a personal API token
*  Personal tokens can be generated at: https://github.com/settings/tokens
*  The token used should have "gist" scope permissions
*/

// BEGIN config
let content = draft.content; // content of the Gist
let fileName = "content.md"; // file name
let isPublic = false; // should this be a public Gist
// END config 

// do credential auth to get a token from the user.
let auth = () => {
	let githubPage = "https://github.com/settings/tokens";
	let cred = Credential.create("GitHub Gist", "Enter personal access token for the GitHub API generated from your developer page at GitHub.com (https://github.com/settings/tokens). This token should have permissions for the scope \"gist\" to allow creation of Gists.");
	
	cred.addTextField("Token", "");
	if (cred.authorize()) {
		return cred.getValue("Token");
	}
	else {
		return false
	}
}

// 
let token = auth();
if (token) {
	let http = HTTP.create();

	let data = {
	  "description": "Gist from Drafts",
	  "public": isPublic,
	  "files": { }  
	};
	data["files"][fileName] = {
		"content": content
	}

	let settings = {
	  "url": "https://api.github.com/gists",
	  "method": "POST",
	  "headers": {"Authorization": `Bearer ${token}`},
	  "data": data
	};

	let response = http.request(settings);
	if (response.statusCode == 201) {
		let responseData = JSON.parse(response.responseText);
		let gistURL = responseData.html_url;

		console.log(responseData);
		console.log(gistURL);
		console.log("Gist created");
		app.setClipboard(gistURL);

		let p = Prompt.create();
		p.title = "Gist created"
		p.message = "Gist created and url placed in the clipboard."
		p.addButton("Open in Safari");

		if (p.show()) {
		  if (p.buttonPressed == "Open in Safari") {
		    app.openURL(gistURL);
		  }
		}
	}
	else {
		console.log(response.statusCode);
		context.fail();
	}
}
else {
	context.cancel();
}

