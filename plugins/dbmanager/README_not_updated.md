
![dbmanager](docs/logo.png "Dbmanager")

----------------------------------------------------------------------

# Dbmanager V 1.0

## Screenshot

![screenshot](docs/screenshot.png "Dbmanager screenshot")

## About

This is a dynamic web app (Single Page Application) for managing a database. It can run through different technologies such as PHP, Node.js, Mysql and Postgresql.


## Installation

1. Upload the compressed file to your web server.
2. Unpack it to the desired folder (files could be inside a folder or not).
3. Edit database settings at: server/nodejs/cfg/dbcfg.json (Node js) or server/php/includes/config.php (Php).
4. Nodejs: Open your terminal at main folder and type: npm install and then npm test. Once the server is running then you can open your web browser (port 8080).
Php: Open your web browser.

## Support

Please write: melchorherrera@gmail.net


## Getting started

There it is the database tables. Click on the tables and then you can navigate under rows and its relationships. You can create, delete and modify, also you can remove links and add links (relationship between elements)


## Troubleshooting

If the database connection is not working you may need to check settings at server/php/cfg/config.php or server/nodejs/cfg/dbcfg.json.

If it doesn't allow admin to make changes you can try to copy server/utils/htaccess file to the folder server/php and rename it to ".htaccess".

