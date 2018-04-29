- **How could I change the page header background?**

If you look into [includes/documentparts/top.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/top.php), you will see the styling class "topimage". So look into the css [includes/css/main.css](https://github.com/petazeta/youronlineshop/blob/master/includes/css/main.css) and find it. Then you either change the css or change the top.php document.

- **How could I change the logo at the right column?**

You must do it manually by changing file: images/logo.png and/or file [includes/documentparts/logo.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/logo.php). And for the browser icon: favicon.ico.

- **How could I change the page default theme?**

There isn't any other themes available. You can modify yourself some of the page look by editing the css and/or changing files at [includes/documentparts](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/) and [includes/templates](https://github.com/petazeta/youronlineshop/blob/master/includes/templates/) folders. Look after the scripts that comes into **data-js** element attribute and the **script** elements so they are defining web behavior and filling elements. Specially look after the templates scripts position, so the script element position is related to the element it works with.

- **How can I add or change fields to the address?**

You just change the address fields (add, remove or name modification) at the database table addresses. Some of the address fields comes from usersdata table.

- **How can I change users names, passwords and privileges?**

There isn't a straight forward way for doing it (but [Dbmanager](http://youronlineshop.sourceforge.net/dbmanager/) would help). But you can make that changes directly at the database: table "users".

For the privileges: those comes with a relationship between table users and table users_userstypes. So you would have to establish that relationship through the "links" table: 

Look for the link: relationship_id: 4 and parent_id: (user id). Then edit that link with the correspondent child_id of the table users_userstypes (or add the link if it isn't there).

- **How can I change page text content that isn't editable by web administrator?**

There are some text content that is at the database and some that is at the templates or "documentparts". For that in the database: look at the table "domelements".

- **How can I get a link of some inside page content?**

There isn't a way to get an URL that would directly bring to a page content. Also page browser History doesn't record the page movements. That could be a problem for bots to index the page.

- **How can I contact for more information?**

**USE** [SOURCEFORGE FORUMS](https://sourceforge.net/p/youronlineshop/discussion/?source=navbar).