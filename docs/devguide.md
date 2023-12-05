Development guide
=================

## Search tools

./search.bash

## keywords

You should search for these keywords in order to find critical elements

- (two or more stars): Elements that require some refactory are marked with some stars in comments.

- development mode: Elements that should be switched on or off in benefit of a better development experience

- production mode: Elements that should be switched on or off for production.

- <--: An arrow like this is a sign that indicates where I am arrived in the development process.

## Conventions

- Better using generic names. For example is better to use the name container instead orderContainer, this way if we need to copy paste we can reuse the code easily.

- Using of white spaces. It is good use one white space in asignation, let x = 2.

- Two white spaces for indentation.

- Use comments but it is better to have a separete documentation file.

- If statments: for if statements with no parenthesis its content go in another line

- semicolon at the end of the line is not used in js

- file names extension is .mjs this way can be used as modules for nodejs.

- From abstraction to specific: A file or module functions will be distributed from top to bottom starting for more abstracted to more specific. That is, the ones at the top would have calls to the ones more at the bottom. This usually will produce in modules that the exported functions would be first. Generic purpose functions that can be used however would be at the bottom.