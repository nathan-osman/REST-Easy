## REST Easy

REST Easy is a Firefox add-on that provides a full-featured REST client in the browser.
It is still a work in progress, but some of the planned features include:

 - support for all HTTP methods (GET, POST, PUT, etc.)
 - POST parameter editor
 - ability to add/modify request headers
 - tools for saving and loading requests

### Screenshots

[![REST Easy](http://i.stack.imgur.com/GzBXb.png)](http://i.stack.imgur.com/27nBA.png)

### Get Involved

Interested in helping out with REST Easy development?
We'd love to have you contribute!
Just fork this repository, make your changes, and submit a pull request.
Here are some of the areas we would like some help in:

 - **JavaScript programmers:** the add-on is written almost exclusively in JavaScript.
   We currently use XMLHttpRequest for sending the requests but this has a couple of drawbacks:
   
    - redirects are automatically followed
    - HTTP basic authentication is handled by the browser (although the add-on can supply the required data)

 - **CSS Designers:** the add-on uses Twitter Bootstrap.
   Currently, there are a set of nasty JavaScipt event handlers that position everything on the page.
   It would be nice if this could be done in CSS somehow.

 - **Localization:** the add-on is not currently l10n-capable yet.
   The goal is to have this implemented sooner rather than later.
