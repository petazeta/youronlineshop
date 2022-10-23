User login
===========

# Introduction

User login is one of the basic feature for almost any web application. It allows to customize the elements for any person or account. This way the elements can be also saved and recovered later on at the next session. The server side user login facility has two functions one is to collect the user credentials (user and password) and the other is to check that the they are correct.

The first facility is named authentication and the second is the login check.

## Authentication

So when user provides its credentials succesfully we want to keep them available for any future user transaction that needs them. For this we need to use some http method. We will use token authentication. Tokens are tranferred in the http header as key value pairs. Tokens can be also encrypted or encoded for them not to be seen. For mantaining some standard we will use Basic Authentication encoding. Basic authentication uses data encoding in Base64 form. It can be easyly decoded but, as the https is now the standard, transaction would be safe.

Collecting the credentials from the header is the task of the authentication script.

## Login check

Login entrance and exit

When entrance for web admin we are showing sometimes the last page because usually we are in in items view and we want to edit them for example. For logout the page state before login is also sometimes stablished.


