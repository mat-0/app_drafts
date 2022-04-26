/*
 * @title: Jekyll formatting -> Working Copy
 * @author: Mat B
 * @email: Mat@thechels.uk
 * @notes:
 * creation behind the scenes.
 */
var credential = Credential.create("Jekyll path", "Jekyll path");
credential.addTextField("jekyll-repo", "Jekyll repo name");
credential.addTextField("jekyll-path", "Path to your jekyll posts directory");
credential.addTextField("working-copy-key", "Working Copy x-url-callback key");

var result = credential.authorize();

if (!result) {
	alert("Failed to obtain required Jekyll data. Please check it and try again.");
	context.cancel("Failed to obtain required Jekyll data. Please check it and try again.");
} else {
    if ((typeof(credential.getValue("jekyll-repo")) === 'undefined' || String(credential.getValue("jekyll-repo")).length === 0) ||
        (typeof(credential.getValue("jekyll-path")) === 'undefined' || String(credential.getValue("jekyll-path")).length === 0) ||
        (typeof(credential.getValue("working-copy-key")) === 'undefined' || String(credential.getValue("working-copy-key")).length === 0)) {
		alert("Repo values are invalid. Please rerun action and enter token again");
		credential.forget();
		context.cancel("Repo values were invalid.");
	} else {
        var newDraft = '',
        content = draft.content,
        prompt = Prompt.create(),
        date = new Date(),
now = new Date().toISOString().substr(0, 10);

        prompt.title = 'Jekyll post data';
        prompt.message = 'Enter Jekyll post data';
        prompt.isCancellable = true;

        if (draft.title.length === 0 || typeof(draft.title.length) === 'undefined') {
            prompt.addTextField('title', 'Title', '');
        } else {
            prompt.addTextField('title', 'Title', draft.title);
        };

        prompt.addTextField('link', 'Link', '');
        prompt.addTextField('date', 'Date', now);
       
        prompt.addButton('Ok');
        prompt.show();

        if (prompt.buttonPressed == "Ok") {
                titleArr = prompt.fieldValues['title'].split(' '),
                fileName = now + '-';

            // modify the filename to be yyyy-mm-dd-title.md
            titleArr.map((t) => fileName += `${t}-`);
            fileName = fileName.replace(/-$/, '');
            fileName += '.md';

            // remove the file name from the draft
            content = content.replace(prompt.fieldValues['title'], '').trim();
            
            // assemble post frontmatter
            newDraft += '---\n';
            newDraft += '\n';
            newDraft += 'layout: post\n'
            newDraft += 'date: ' + prompt.fieldValues['date'] + '\n';

            if (prompt.fieldValues['link'] !== '')
                newDraft += 'link: ' + prompt.fieldValues['link'] + '\n';

            newDraft += 'title: ' + prompt.fieldValues['title'] + '\n';
            newDraft += '\n';
            newDraft += '---\n';
            newDraft += '\n';
            newDraft += content;

            // set draft content
            editor.setText(newDraft);

            // send to working copy
            var baseURL = 'working-copy://x-callback-url/write/?key=' + 
                          credential.getValue("working-copy-key") + 
                          '&repo=' + encodeURI(credential.getValue("jekyll-repo")) + 
                          '&path=' + encodeURI(credential.getValue("jekyll-path")) + 
                          '/' + 
                          encodeURI(fileName.toLowerCase()) + 
                          '&text=' + 
                          encodeURI(newDraft),
                cb = CallbackURL.create();

            cb.baseURL = baseURL;
            cb.open();
        };
    }
};