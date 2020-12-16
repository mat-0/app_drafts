/*
  Create new draft with template text and tag assigned.
*/

// create template
const template = `# quote

> 

- 

`;

// create the draft
var d = Draft.create();
d.content = template;
d.addTag("quote");
d.update()

// load in editor and focus for editing
editor.load(d);
editor.focus()