// This script fetches your GitHub repos (sorted by most recently active),
// and then presents a prompt to pick one. A new issue is then created in
// that repo using the current draft's contents.
//
// NOTE: The first time you run this action you'll need to supply it with a
// GitHub Personal Access Token that has read/write permissions to the repos
// on your account. You can generate a token here:
// https://github.com/settings/tokens

let NumberOfRecentReposToFetch = 5;

var credential = Credential.create("GitHub", "A GitHub Personal Access Token with read/write repo permissions.");
credential.addTextField("token", "Personal Access Token");
credential.authorize();

let repos = getRecentRepos();
if (repos.length > 0) {
	let p = Prompt.create();
	p.title = "Choose Repo";
	for (var i = 0; i < repos.length; i++) {
		p.addButton(repos[i].full_name, i);
	}
	if (p.show()) {
		let full_name = repos[p.buttonPressed].full_name;
		createGitHubIssue(full_name, draft.title, draft.content);
	}
}

// Fetches the NumberOfRecentReposToFetch most recent repos
// (both public and private) from the authorized GitHub account.
function getRecentRepos() {
	var http = HTTP.create();
	var response = http.request({
		"url": "https://api.github.com/user/repos?sort=pushed&per_page=" + NumberOfRecentReposToFetch,
		"method": "GET",
		"headers": {
			"Authorization": "token " + credential.getValue("token"),
			"User-Agent": "Drafts-Issue-Bot"
		}
	});
	return JSON.parse(response.responseText);
}

// Create a new GitHub issue in the repo identified by full_name,
// which is in a "username/repo" format.
function createGitHubIssue(full_name, title, body) {
	var json = {
		title: title,
		body: body
	};

	var http = HTTP.create();
	var response = http.request({
		"url": "https://api.github.com/repos/" + full_name + "/issues",
		"method": "POST",
		"data": json,
		"headers": {
			"Authorization": "token " + credential.getValue("token"),
			"User-Agent": "Drafts-Issue-Bot"
		}
	});
}
