/*********************************
 *  REST Easy Ember Application  *
 * Copyright 2014 - Nathan Osman *
 *********************************/

// Constants
var HTTP_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'LINK', 'UNLINK', 'OPTIONS'],
    DM_NONE = tr('request.data.type.none'),
    DM_FORM = tr('request.data.type.form'),
    DM_CUSTOM = tr('request.data.type.custom'),
    DATA_MODES = [DM_NONE, DM_FORM, DM_CUSTOM],
    FT_URLENCODED = 'application/x-www-form-urlencoded',
    FT_MULTIPART = 'multipart/form-data',
    FORM_TYPES = [FT_URLENCODED, FT_MULTIPART];

// Create the application and set the window title
window.RESTEasy = Ember.Application.create();
window.document.title = tr('application.title');

// Main controller for the REST Easy application
RESTEasy.ApplicationController = Ember.Controller.extend({
    methods: HTTP_METHODS,
    dataModes: DATA_MODES,
    formTypes: FORM_TYPES,

    // Translations for attributes
    trDataType: tr('request.data.custom.type'),
    trUsername: tr('request.auth.username'),
    trPassword: tr('request.auth.password'),

    // Initialize the application for the first time
    init: function() {

        // REST Easy reuses a single XMLHttpRequest instead of creating a new
        // one for each request - this reduces the number of state variables
        var self = this,
            request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            self.send('readyStateChange', request);
        };
        this.set('request', request);

        // Reset all values to their defaults
        this.send('reset');
    },

    // Parse a string containing response headers, returning a list of objects
    // containing a name and value property
    parseHeaders: function(headers) {
        return headers.trim().split('\n').map(function(header) {
            var i = header.indexOf(':');
            return {
                name: header.substr(0, i),
                value: header.substr(i + 1)
            };
        });
    },

    actions: {

        saveRequest: function() {
            alert("Saving request..." + this.get('saveName'));
        },

        // Clear all values and set them to their defaults
        reset: function() {
            this.set('method', HTTP_METHODS[0]);
            this.set('url', '');
            this.set('requestHeaders', []);
            this.set('dataMode', DATA_MODES[0]);
            this.set('formType', FORM_TYPES[0]);
            this.set('formData', []);
            this.set('dataType', '');
            this.set('dataCustom', '');
            this.set('username', '');
            this.set('password', '');
            this.set('response', null);
            this.set('saveName', '');
        },

        // Show and hide the about dialog
        showAbout: function() { this.set('displayAbout', true); },
        hideAbout: function() { this.set('displayAbout', false); },

        // Open a new request using the values from the UI and send it
        send: function() {
            var request = this.get('request'),
                dataMode = this.get('dataMode'),
                username = this.get('username'),
                password = this.get('password');

            request.open(
                this.get('method'),
                this.get('url'),
                true  // async?
            );

            // Obtain the nsIHttpChannel interface so that there are virtually
            // no restrictions on which headers may be set
            var channel = request.channel.QueryInterface(Components.interfaces.nsIHttpChannel);
            this.get('requestHeaders').forEach(function(e) {
                channel.setRequestHeader(e.name, e.value, false);
            });

            // Set HTTP basic auth data if provided
            if(username.length || password.length) {
                channel.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password), false);
            }

            // If no mode was selected, don't include any data
            if(dataMode === DM_NONE) {
                request.send();

            // If form mode was selected, create and populate a FormData
            } else if(dataMode === DM_FORM) {

                var formData;

                // Manually build the query string for application/x-www-form-urlencoded
                if(this.get('formType') === FT_URLENCODED) {
                    formData = [];
                    this.get('formData').forEach(function(e) {
                        formData.push(encodeURIComponent(e.name) + '=' + encodeURIComponent(e.value));
                    });
                    formData = formData.join('&');
                    channel.setRequestHeader('Content-type', FT_URLENCODED, false);

                // Otherwise use FormData to build the multipart data
                } else {
                    formData = new FormData();
                    this.get('formData').forEach(function(e) {
                        formData.append(e.name, e.value);
                    });
                }

                // Send the request
                request.send(formData);

            // Form mode must be custom - just send the provided data
            } else {
                channel.setRequestHeader('Content-type', this.get('dataType'), false);
                request.send(this.get('dataCustom'));
            }

            // Display the progress dialog
            this.set('displayProgress', true);
        },

        // Check for completion of the request and display the results
        readyStateChange: function(request) {
            if(request.readyState === 4) {
                var headers = this.parseHeaders(request.getAllResponseHeaders()),
                    contentType = request.getResponseHeader('Content-Type'),
                    response = {
                        status: request.status,
                        statusText: request.statusText,
                        headers: headers,
                        contentType: contentType,
                        raw: request.response
                    };

                if (contentType) {
                    // TODO: this is not implemented correctly for binary filetypes
                    // - raw should be a hex dump and (for images) a preview should
                    //   be displayed

                    // If the MIME type is text/*, then display a preview of the document
                    if(contentType.substring(0, 5) == 'text/')
                        response['preview'] = 'data:' + contentType + ',' + encodeURIComponent(request.response);
                }

                // Try to parse the response to JSON
                try {
                    response['json'] = JSON.stringify(JSON.parse(request.response), null, 2);
                } catch (e) {
                    response['json'] = false;
                }

                // Display the response and hide the progress dialog
                this.set('response', response);
                this.set('displayProgress', false);
            }
        },

        // Abort the request in progress
        cancel: function() {
            this.get('request').abort();
            this.set('displayProgress', false);
        }
    }
});
