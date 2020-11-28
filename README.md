
# Your Online Shop System V 2.0.0

<table>
  <tr>
    <td style="padding:1em">
      <h2>Sample</h2>
      <a href="https://a.fsdn.com/con/app/proj/youronlineshop/screenshots/yos-1178.png/max/max/1">
        <img itemprop="screenshot" src="https://a.fsdn.com/con/app/proj/youronlineshop/screenshots/yosnew.png/245/183/1" width="245" height="183" alt="desktop admin">
      </a>
    </td>
    <td style="padding:1em">
      <h2>YouTube</h2>
      <a title="You Tube Video" rel="section" href="https://www.youtube.com/channel/UC2z0Kj-fLkCilGg2tSztG-w/">
        <img src="https://img.youtube.com/vi/b41mUXtEn8I/hqdefault.jpg" width="245" height="183">
      </a>
    </td>
  </tr>
</table>

## Live Demo

Shop with sample products -> [Your Online Shop Demo Shop](http://youronlineshop.sourceforge.net/sample/)

Admin -> (usr/password) webadmin/webadmin , ordersadmin/ordersadmin, productsadmin/productsadmin

## Autor Note

This program has been developed by: Alberto Melchor Herrera, melchorherrera@gmail.com. I am greateful to the people that have developed software in which I got inspiration. This version of the software is free to use and modify. I am available at the email for any support and other issues.


## About

It implements an e-commerce system (Ajax and WYSIWYG). It is written in PHP (As well as HTML, CSS and JavaScript). It uses Mysql for a database.


## Installation

1. Upload the files to your web server.
2. Unpack it to the destination folder (you may have to create it first).
3. Create a database. You can use PhpMyAdmin for this pourpose.
4. Edit database settings at: includes/config.php.
5. Give write permisions to the folders catalog/images/small and catalog/images/big (To allow upload product images).
6. Also you can change some system settings at file: javascript/config.js.
7. *** [Installation Video Tutorial](https://youtu.be/eDbpvEcX95Y) ***
8. For further database control install the complement [DbManager](https://sourceforge.net/projects/freshhh-dbmanager/).

## Getting started

Open the browser (chrome or firefox) at the main folder URL. The ecommerce system will appear. You must click "initialize database" button at first time.

There are some already created users: "webadmin" and "ordersadmin". These are the users names, and users passwords are the same as users names.

User "ordersadmin" is order administrator and can watch and edit all the orders. Once you log in with this user click at "Show orders" button.

User "webadmin" is web administrator user and can edit the web page content, the catalog (categories and items) and the checkout process options.

There are also some other admin users: productsadmin, usersadmin, productseller and systemadmin.

Once editing some content press Intro or click outside of the editable area to save changes.

To reach checkout process edition you should log in with the webadmin user and make an order as you were logged in as a normal user. Once you get to some checkout steps you should be able to edit the checkout step options. Some extra edition elements that can not be reached as a web user can be accessed by cicking the Extra Elements button that will appear at the left bar just after log in as webadmin.

For system configuration edit file javascript/config.js

## Frequently Asked Questions*

- How can I enable the paypal account for the payment process?

You must add your paypal id at the required parameter. That parameter can be accessed by getting to the checkout payment step logged in as admin.

## More Info

Find us at [YourOnlineShop.net](http://www.youronlineshop.net) for more information.

Some project documentation: [project wiki](https://github.com/petazeta/youronlineshop/wiki/).

## Support

info@youronlineshop.net
