## REST Easy

REST Easy is a Firefox add-on that provides a full-featured REST client in the browser.
It is still a work in progress, but the features currently implemented include:

 - support for GET, POST, and HEAD methods
 - parameter editor for POST requests
 - ability to customize nearly every HTTP request header
 - preview of HTML both as text and rendered in the browser
 - syntax highlighting for HTML, JavaScript/JSON, and XML
 - preview of images and a simple hex viewer for binary files

Features planned for upcoming releases include:

 - tools for saving and loading requests

[![Add to Firefox](http://i.stack.imgur.com/JE1T5.png)](https://addons.mozilla.org/en-US/firefox/addon/rest-easy/)

### Instructions

Using REST Easy is simple: just click the toolbar button or the "REST Easy" item in the web developer menu.

### Screenshots

[![](http://i.stack.imgur.com/yADPd.png)](http://i.stack.imgur.com/Ad3Uf.png)

[![](http://i.stack.imgur.com/W8EU5.png)](http://i.stack.imgur.com/iZUX3.png)
[![](http://i.stack.imgur.com/ZVsox.png)](http://i.stack.imgur.com/o127F.png)


### Get Involved

Interested in helping out with REST Easy development?
We'd love to have you contribute!
Just fork this repository, make your changes, and submit a pull request.
Here are some of the areas we would like some help in:

 - **JavaScript programmers:** the add-on is written almost exclusively in JavaScript.
   We currently use XMLHttpRequest for sending the requests but this has three of drawbacks:

    - certain request headers cannot be set
    - redirects are automatically followed
    - HTTP basic authentication is handled by the browser (although the add-on can supply the required data)

 - **CSS Designers:** the add-on uses Twitter Bootstrap.
   Currently, there are a set of nasty JavaScript event handlers that position everything on the page.
   It would be nice if this could be done in CSS somehow.

 - **Localization:** the add-on currently provides only an English translation.
   All translations for other languages are welcome.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/nathan-osman/rest-easy/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
