/*********************************
 *  REST Easy Ember Application  *
 * Copyright 2014 - Nathan Osman *
 *********************************/

// Constants
var HTTP_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'LINK', 'UNLINK', 'OPTIONS'],
    DATA_NONE = 'None',
    DATA_FORM = 'Form',
    DATA_CUSTOM = 'Custom Data',
    DATA_MODES = [DATA_NONE, DATA_FORM, DATA_CUSTOM];

// Load the translation strings for the current locale and create a map from them
(function() {
    Components.utils.import('resource://gre/modules/Services.jsm');
    var bundle = Services.strings.createBundle('chrome://resteasy/locale/resteasy.properties'),
        senum = bundle.getSimpleEnumeration(),
        strings = {},
        string;

    // Add each of the strings in the bundle to the map
    while(senum.hasMoreElements()) {
        string = senum.getNext().QueryInterface(Components.interfaces.nsIPropertyElement);
        strings[string.key] = string.value;
    }
    Ember.I18n.translations = strings;
})();

// Create the application and set the window title
window.RESTEasy = Ember.Application.create();
window.document.title = Ember.I18n.t('ui.title');

// Main controller for the REST Easy application
RESTEasy.ApplicationController = Ember.Controller.extend({
    methods: HTTP_METHODS,
    dataModes: DATA_MODES,

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
            this.set('dataForm', []);
            this.set('dataCustom', '');
            this.set('username', '');
            this.set('password', '');
            this.set('response', null);
        },

        // TODO: make this into a proper dialog box - this works for now
        about: function() {
            window.alert('REST Easy - Simple REST Client\nCopyright 2014 - Nathan Osman');
        },

        // Open a new request using the values from the UI and send it
        send: function() {
            var request = this.get('request');
            request.open(
                this.get('method'),
                this.get('url'),
                true,  // async?
                this.get('username'),
                this.get('password')
            );

            // Obtain the nsIHttpChannel interface so that there are virtually
            // no restrictions on which headers may be set
            var channel = request.channel.QueryInterface(Components.interfaces.nsIHttpChannel);
            this.get('requestHeaders').forEach(function(e) {
                channel.setRequestHeader(e.name, e.value, false);
            });

            // Send the request and display the progress dialog
            request.send();
            this.set('inProgress', true);
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
                this.set('inProgress', false);
            }
        },

        // Abort the request in progress
        cancel: function() {
            this.get('request').abort();
            this.set('inProgress', false);
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
    classNames: ['request'],

    // Properties for dataMode
    dataForm: function() {
        return this.get('controller.dataMode') === DATA_FORM;
    }.property('controller.dataMode'),
    dataCustom: function() {
        return this.get('controller.dataMode') === DATA_CUSTOM;
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
                $(document).off('mouseup', mouseUp);
            }

            // Bind the handlers until the mouse button is released
            $(document).on('mousemove', mouseMove);
            $(document).on('mouseup', mouseUp);
        });
    }
})

// View for examining a response
RESTEasy.ResponseView = Ember.View.extend({
    templateName: 'app-response',
    classNames: ['response']
});

// View for displaying a request in progress
RESTEasy.ProgressView = Ember.View.extend({
    templateName: 'app-progress',
    classNames: ['progress'],
    classNameBindings: ['controller.inProgress:active']
});

// TODO: the combo box and collapsible section control have identical toggle
// methods - it might be a good idea for them to share a base class

// Combo box control displaying contents as a drop-down menu
RESTEasy.ComboBoxComponent = Ember.Component.extend({
    classNames: ['combo'],
    expanded: false,
    actions: {
        toggle: function() {
            this.set('expanded', !this.get('expanded'));
        },
        select: function(item) {
            this.set('selection', item);
            this.set('expanded', false);
        }
    }
});

// Collapsible section control that hides its content by default
RESTEasy.CollapsibleSectionComponent = Ember.Component.extend({
    classNames: ['section'],
    expanded: false,
    actions: {
        toggle: function() {
            this.set('expanded', !this.get('expanded'));
        }
    }
});

// Editable table
RESTEasy.EditableTableComponent = Ember.Component.extend({
    tagName: 'table',
    name: null,
    value: null,
    actions: {
        add: function() {
            this.get('entries').pushObject({
                name: this.get('name'),
                value: this.get('value')
            });
            this.set('name', '');
            this.set('value', '');
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
        return this.get('parentView.activeTab') == this.get('name');
    }.property('parentView.activeTab'),

    // Set the tab as the active tab
    click: function() {
        this.set('parentView.activeTab', this.get('name'));
    }
});

// Tab content within a tab container
RESTEasy.TabContentComponent = Ember.Component.extend({
    classNames: ['content'],
    classNameBindings: ['active'],

    // Indicate if this tab is currently active
    active: function() {
        return this.get('parentView.activeTab') == this.get('name');
    }.property('parentView.activeTab')
});
