![Your Online Shop](readme_images/logotype.png "Your Online Shop")

=> [Demo Shop](https://youronlineshop.net/sample/)

Admins (usr/password) => webadmin/webadmin, productsadmin/productsadmin

=> [Video Demo](https://youtu.be/PD_olszbGWA)
<table>
  <tr>
    <td>
    <a href="https://youtu.be/PD_olszbGWA"><img src="readme_images/youtube.webp"></a>
    </td>
  </tr>
</table>

## About

This is a SPA (Single Page Application) for e-commerce. It is build in Node.js and Mongodb and it has no dependencies.

https://youronlineshop.net

Awards:

<img src="readme_images/oss-community-choice-white.svg" alt="Community choice" width="120"/>

## Main features:

- Easy shop edition
- Quick purchase process
- Website pages (About, Contact, ect...)
- Easy skins edition
- [Multi shop](docs/multishopguide.md)

## Installation

1. Get the source files.
2. Install node and mongodb when necesary.
3. Edit the mongodb url when cecesary at: server/context__main/cfg.mjs.
4. Open your terminal at the source top folder and type:
```
npm install 
npm start
```
5. The server is running now. Continue in browser as prompt tells.

## Support

It works at Node v.16 and mongodb v.4. We can no guarantee it would work on a different version.

For any issues please write to: melchorherrera@gmail.com. We will gladly appreciate any bug report.


## Getting started

Once Your Online Shop is installed you can open your browser at the correspondent url address. Lets log-in with some of the admin users to make changes: user webadmin for web content and productsadmin for catalog content. Other operations can be done by user systemadmin, and to check customer orders log-in with ordersadmin.

After editing some content press Intro or click outside of the editable area to save changes.

To edit some features from the checkout process you should log in with systemadmin user and make an order as if you were a customer. Once you get to the checkout step you should be able to edit checkout options.

Some other configuration can be done by editing some files at cfg folders.


## Documentation

[Check Documentation](docs/overview.md)


## Skins

Y.O.S. system have layouts files that can be modified. You can find these files at layouts folder.


## Extensions

There is a preinstalled extension to manage the database records, check prompt messages.


## More

Consider giving us a star.