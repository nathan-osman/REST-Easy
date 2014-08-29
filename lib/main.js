/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var { Cc, Ci } = require('chrome');
var self = require('sdk/self');
var tabs = require('sdk/tabs');
var { ActionButton } = require('sdk/ui/button/action');
var _ = require('sdk/l10n').get;

// Create the toolbar button used to open the page.
var button = ActionButton({
    id: 'resteasy',
    label: _('REST Easy'),
    icon: {
        '16': self.data.url('img/resteasy-16.png'),
        '32': self.data.url('img/resteasy-32.png')
    },
    
    // Open a new tab with REST Easy when clicked.
    onClick: function() {
        tabs.open({
            url: self.data.url('resteasy.html'),
            onReady: function(tab) {
                
                // Attach the bridge.
                var worker = tab.attach({
                    contentScriptFile: self.data.url('js/bridge.js')
                });
                
                // Listen for translation messages.
                worker.port.on('translate', function(id) {
                    worker.port.emit('translation', {
                        id: id,
                        text: _(id)
                    });
                });
                
                // Listen for request messages.
                worker.port.on('request', function(data) {
                    
                    // Create the HTTP request and initialize it.
                    var request = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
                    request.open(data.method,
                                 data.url,
                                 true,
                                 data.username,
                                 data.password);
                    request.responseType = 'arraybuffer';
                    
                    var contentType = '';
                    var body = data.content.trim();
                    var bodySetted = body.length != 0;
                    if(bodySetted) {
                        if(body.indexOf('{') == 0) {
                            contentType = 'application/json';
                        } else if (body.indexOf('<') == 0){
                            contentType = 'application/xml';
                        }
                    } else {
                        contentType = 'application/x-www-form-urlencoded';
                    }
                    // If this is a POST request, set the content-type header.
                     if(data.method == 'POST') {
                         request.setRequestHeader('Content-type', contentType);
                    }

                    // We need to use 'channel' in order to set certain request headers.
                    var channel = request.channel.QueryInterface(Ci.nsIHttpChannel);
                    for(var name in data.headers)
                        channel.setRequestHeader(name, data.headers[name], false);
                    
                    // When the response is received, emit a message with the response.
                    request.onreadystatechange = function() {
                        if(request.readyState == 4)
                            worker.port.emit('response', {
                                status: request.status,
                                statusText: request.statusText,
                                headers: request.getAllResponseHeaders(),
                                contentType: request.getResponseHeader('Content-Type') || ''
                            });
                    };
                    
                    // Add the parameters.
                    var params = [];
                    for(var param in data.parameters)
                        params.push(encodeURIComponent(param) + '=' + encodeURIComponent(data.parameters[param]));
                    params = params.join('&');
                    
                    // Send the request.
                    if(bodySetted){
                        request.send(body);     
                    } else {
                        request.send(params);
                    }
                    
                });
            }
        });
    }
});
