New installation
================

When the main.js script detects there is no languages at the database it launchs the layout dbimport. This layout has a button to populate the database. When clicking the button we make the request "reset database" that will [populate the database](servernewinstall.md). Once the request has been finished it is loading the text content. Then, after login with systemadmin, it shows an alert to notice the user we are going to go to the next step: changing admin passwords. Then it shows the layout chgadmnpwd.

The chgadmnpwd layout shows the admins users appending a inner layout for any of them. This layout contains the fileds for the new password and the button to perform the password change. When clicked they invoke the corresponden user method for it.