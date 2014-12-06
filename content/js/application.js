/*********************************
 *  REST Easy Ember Application  *
 * Copyright 2014 - Nathan Osman *
 *********************************/

// Register a helper to aid in translation
(function() {
    Components.utils.import('resource://gre/modules/Services.jsm');
    var bundle = Services.strings.createBundle('chrome://resteasy/locale/resteasy.properties');

    // Create the 'tr' function and register it as a helper
    var tr = window.tr = function(name) {
        return bundle.formatStringFromName(name, [], 0);
    }
    Ember.Handlebars.registerBoundHelper('tr', tr);
})();

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

        // Clear all values and set them to their defaults
        reset: function() {
            this.set('method', HTTP_METHODS[0]);
            this.set('url', '');
            this.set('requestHeaders', []);
            this.set('dataMode', DATA_MODES[0]);
            this.set('formType', FORM_TYPES[0]);
            this.set('formData', []);
            this.set('customType', '');
            this.set('customData', '');
            this.set('username', '');
            this.set('password', '');
            this.set('response', null);
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
                    response = {
                        status: request.status,
                        statusText: request.statusText,
                        headers: headers,
                        raw: request.response
                    },
                    contentType = request.getResponseHeader('Content-Type');

                // TODO: this is broken for binary filetypes - raw should be a
                // hex dump and (for images) a preview should be displayed

                // If the MIME type is text/*, then display a preview of the document
                if(contentType.substring(0, 5) == 'text/')
                    response['preview'] = 'data:' + contentType + ',' + encodeURIComponent(request.response);

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

// View for the header at the top of the page
RESTEasy.HeaderView = Ember.View.extend({
    templateName: 'app-header',
    classNames: ['header']
});

// View for setting request
RESTEasy.RequestView = Ember.View.extend({
    templateName: 'app-request',
    classNames: ['pane', 'first'],

    // Form data controls should be displayed?
    dmForm: function() {
        return this.get('controller.dataMode') === DM_FORM;
    }.property('controller.dataMode'),

    // Custom data controls should be displayed?
    dmCustom: function() {
        return this.get('controller.dataMode') === DM_CUSTOM;
    }.property('controller.dataMode')
});

// View for the splitter dividing the two panes
RESTEasy.SplitterView = Ember.View.extend({
    classNames: ['splitter'],

    // Setup the event handlers for the splitter
    didInsertElement: function() {
        var $splitter = $(this.get('element')),
            $pane = $splitter.prev();

        $splitter.mousedown(function(e) {
            e.preventDefault();

            // Capture the initial width of the pane and position of the mouse
            // relative to the document
            var paneW = $pane.width(),
                pageX = e.pageX;

            function mouseMove(e) {
                $pane.width(paneW - (pageX - e.pageX));
            }

            function mouseUp() {
                $(document).off('mousemove', mouseMove);
            }

            // Bind the handlers until the mouse button is released
            $(document).on('mousemove', mouseMove);
            $(document).one('mouseup', mouseUp);
        });
    }
})

// View for examining a response
RESTEasy.ResponseView = Ember.View.extend({
    templateName: 'app-response',
    classNames: ['pane']
});

// Combo box control displaying contents as a drop-down menu
RESTEasy.ComboBoxComponent = Ember.Component.extend({
    classNames: ['combo', 'control'],

    actions: {
        show: function() {
            this.set('expanded', true);

            // Hide the menu when anything is clicked
            var self = this;
            function hide(e) {
                self.set('expanded', false);
                $(document).off('click', hide);
            }

            $(document).on('click', hide);
        },
        select: function(item) {
            this.set('selection', item);
        }
    }
});

// Collapsible section control that hides its content by default
RESTEasy.CollapsibleSectionComponent = Ember.Component.extend({
    classNames: ['section'],
    actions: {
        toggle: function() {
            this.set('expanded', !this.get('expanded'));
        }
    },

    // Returns the appropriate Font Awesome class for the button
    // depending on whether it is expanded or not
    buttonClass: function() {
        return this.get('expanded') ? 'fa-minus' : 'fa-plus';
    }.property('expanded')
});

// Editable table for simple name/value storage
RESTEasy.EditableTableComponent = Ember.Component.extend({
    tagName: 'table',
    classNames: ['table'],

    // Translations for attributes
    trName: tr('table.name'),
    trValue: tr('table.value'),
    trRemove: tr('table.remove'),
    trAdd: tr('table.add'),

    actions: {
        add: function() {
            var name = this.get('name'),
                value = this.get('value');
            // Don't add anything unless both fields are filled in
            if(name && value) {
                this.get('entries').pushObject({
                    name: name,
                    value: value
                });
                this.set('name', '');
                this.set('value', '');
            }
        },
        remove: function(o) {
            this.get('entries').removeObject(o);
        }
    }
});

// Tab container for buttons and content
RESTEasy.TabContainerComponent = Ember.Component.extend({
    classNames: ['tabs']
});

// Tab button within a tab container
RESTEasy.TabButtonComponent = Ember.Component.extend({
    tagName: 'button',
    classNames: ['tab'],
    classNameBindings: ['active'],

    // Indicate if this tab is currently active
    active: function() {
        return this.get('parentView.activeTab') == this.get('title');
    }.property('parentView.activeTab'),

    // Set the tab as the active tab
    click: function() {
        this.set('parentView.activeTab', this.get('title'));
    }
});

// Tab content within a tab container
RESTEasy.TabContentComponent = Ember.Component.extend({
    classNames: ['content'],
    classNameBindings: ['active'],

    // Indicate if this tab is currently active
    active: function() {
        return this.get('parentView.activeTab') == this.get('title');
    }.property('parentView.activeTab')
});

// Modal dialog box
RESTEasy.DialogBoxComponent = Ember.Component.extend({
    classNames: ['dialog'],
    classNameBindings: ['active']
});
