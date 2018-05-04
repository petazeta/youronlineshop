**These are some advices so you can start acting with the code quickly**.

The site view is structured in the following parts:

- Top head
- Nav bar
- Left column
- Right column
- Central content
- Bottom

That parts code would be found in files at [includes/documentparts](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/) folder. The central content would change but the others are fixed. So for the central content there isn't a unique file but several ones. The central content elements used to be at [includes/templates](https://github.com/petazeta/youronlineshop/blob/master/includes/templates/) folder.

To master the code we have splitted the page in files. Some files just give a document layout, like for example: three columns. And then get some other files into those columns through out the `include` directive (php).

Some page content filling comes after the achievement of some previous actions. Thats why you would find `webuser.addEventListener("loadses", function...` several times in files bottom script at [includes/documentparts](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/) folder.

Some elements are loaded through out `refreshChildreview` or `refreshView` methods. That methods get a container (Dom element of the web page) and a template (file) and then fill the container with the template performing also the actions commanded at the template.

Index.php is the beginning file. Files at documentparts and templates folder are just ".php" but actually most of then doesn't have any php command.

Some page content fillings are in nested way: so sometimes the references must be well researched before giving a straight resolution. Sometimes we are filling a template with another template that is inside or comes with some other template and so on.

You would find `thisNode` and `thisElement` vars several times at the templates scripts. thisNode is a javascript object that usually contains the information to fill in with (or it is a parent of it) and is related to a database record (row). And thisElement is (refers) a Dom element. When the script comes inside the "data-js" element attribute: then thisElement is this one, and when it comes in a "script" element: then it is the element above.