/*
  Create new draft with template text and tag assigned.
*/

// create template
const template = `# [team]

## Meeting Notes

- Attendees:
- Absentees:

## Observations

- 
- 
- 

#### [topic]
-
-
-

#### [topic]
-
-
-

#### Actions

- [ ]
- [ ]
- [ ]

`;

// create the draft
var d = Draft.create();
d.content = template;
d.addTag("review");
d.addTag("work");
d.update()

// load in editor and focus for editing
editor.load(d);
editor.focus()