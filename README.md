## REST Easy

REST Easy is a Firefox add-on that provides a full-featured REST client in the browser.
It is still a work in progress, but the features currently implemented include:

 - support for GET, POST, and HEAD methods
 - parameter editor for POST requests
 - ability to customize HTTP request headers
 - preview of HTML both as text and rendered in the browser

Features planned for upcoming releases include:

 - tools for saving and loading requests
 - localization

[![Add to Firefox](http://i.stack.imgur.com/JE1T5.png)](https://addons.mozilla.org/en-US/firefox/addon/rest-easy/)

### Instructions

Using REST Easy is simple: just click the toolbar button or the "REST Easy" item in the web developer menu.

### Screenshots

[![REST Easy](http://i.stack.imgur.com/GzBXb.png)](http://i.stack.imgur.com/27nBA.png)

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
   Currently, there are a set of nasty JavaScipt event handlers that position everything on the page.
   It would be nice if this could be done in CSS somehow.

 - **Localization:** the add-on is not currently l10n-capable yet.
   The goal is to have this implemented sooner rather than later so that translating can begin.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/nathan-osman/rest-easy/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
