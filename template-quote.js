/*
  Create new draft with template text and tag assigned.
*/

// create template
const template = `# Title

> quote

- author

`;

// create the draft
var d = Draft.create();
d.content = template;
d.addTag("tagname");
d.update()

// load in editor and focus for editing
editor.load(d);
editor.focus()
