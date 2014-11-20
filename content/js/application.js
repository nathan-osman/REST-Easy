/*********************************
 *  REST Easy Ember Application  *
 * Copyright 2014 - Nathan Osman *
 *********************************/

window.RESTEasy = Ember.Application.create();

/**
 * Load the translation strings for the current locale and create a map from them.
 */
(function() {
    Components.utils.import('resource://gre/modules/Services.jsm');
    var bundle = Services.strings.createBundle('chrome://resteasy/locale/resteasy.properties'),
        senum = bundle.getSimpleEnumeration(),
        strings = {},
        string;
    while(senum.hasMoreElements()) {
        string = senum.getNext().QueryInterface(Components.interfaces.nsIPropertyElement);
        strings[string.key] = string.value;
    }
    Ember.I18n.translations = strings;
})();

/**
 * Main controller for the REST Easy application.
 * The actual sending of requests and receiving of responses takes place here.
 */
RESTEasy.ApplicationController = Ember.Controller.extend({
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'LINK', 'UNLINK', 'OPTIONS'],
    method: 'GET',
    requestHeaders: [],
    init: function() {
        var self = this,
            request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            self.send('readyStateChange', request);
        };

        this.set('request', request);
    },
    actions: {
        send: function() {
            var request = this.get('request');
            request.open(
                this.get('method'),
                this.get('url'),
                true,  // async?
                this.get('username'),
                this.get('password')
            );

            // Obtain an nsIHttpChannel interface so that any header can be set
            var channel = request.channel.QueryInterface(Components.interfaces.nsIHttpChannel);
            this.get('requestHeaders').forEach(function(e) {
                channel.setRequestHeader(e.name, e.value, false);
            });

            request.send();
            this.set('inProgress', true);
        },
        readyStateChange: function(request) {
            if(request.readyState === 4) {
                var headers = request.getAllResponseHeaders().trim().split('\n').map(function(header) {
                    index = header.indexOf(':');
                    return {
                        name: header.substr(0, index),
                        value: header.substr(index + 1)
                    };
                });

                var contentType = request.getResponseHeader('Content-Type'),
                    response = {
                        status: request.status + ' ' + request.statusText,
                        headers: headers,
                        raw: request.response
                    };

                if(contentType.substring(0, 5) == 'text/')
                    response['preview'] = 'data:' + contentType + ',' + encodeURIComponent(request.response);

                this.set('response', response);
                this.set('inProgress', false);
            }
        },
        cancel: function() {
            this.get('request').abort();
            this.set('inProgress', false);
        }
    }
});

/**
 * View for the header at the top of the page.
 */
RESTEasy.HeaderView = Ember.View.extend({
    templateName: 'app-header',
    classNames: ['header']
});

/**
 * View for issuing a request.
 * Includes controls for setting the request method, URL, headers, etc.
 */
RESTEasy.RequestView = Ember.View.extend({
    templateName: 'app-request',
    classNames: ['request']
});

/**
 * View for the splitter dividing the two panes.
 */
RESTEasy.SplitterView = Ember.View.extend({
    classNames: ['splitter'],
    didInsertElement: function() {
        var $splitter = $(this.get('element')),
            $pane = $splitter.prev();

        $splitter.mousedown(function(e) {

            e.preventDefault();

            // Capture the initial width of the pane and position
            // of the mouse relative to the document
            var paneW = $pane.width(),
                pageX = e.pageX;

            function mouseMove(e) {
                $pane.width(paneW - (pageX - e.pageX));
            }

            function mouseUp() {
                $(document).off('mousemove', mouseMove);
                $(document).off('mouseup', mouseUp);
            }

            // Bind the event until the mouse button is released
            $(document).on('mousemove', mouseMove);
            $(document).on('mouseup', mouseUp);
        });
    }
})

/**
 * View for examining a response.
 * Includes tabs for viewing response headers, previewing content, etc.
 */
RESTEasy.ResponseView = Ember.View.extend({
    templateName: 'app-response',
    classNames: ['response']
});

/**
 * View for displaying a request in progress.
 */
RESTEasy.ProgressView = Ember.View.extend({
    templateName: 'app-progress',
    classNames: ['progress'],
    classNameBindings: ['controller.inProgress:active']
});

// TODO: the combo box and collapsible section control have identical
// toggle methods - might be a good idea for them to share a base class

/**
 * Combo box control displaying contents as a drop-down menu.
 * Clicking the button toggles the menu. Clicking an item selects it and hides
 * the menu.
 */
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

/**
 * Collapsible section control that hides its content by default.
 * Clicking the button in the corner toggles the section.
 */
RESTEasy.CollapsibleSectionComponent = Ember.Component.extend({
    classNames: ['section'],
    expanded: false,
    actions: {
        toggle: function() {
            this.set('expanded', !this.get('expanded'));
        }
    }
})

/**
 * Editable table.
 * Items can be added to the table and removed.
 */
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

/**
 * Tab container for buttons and content.
 * Changes the content displayed when a tab button is clicked.
 */
RESTEasy.TabContainerComponent = Ember.Component.extend({
    classNames: ['tabs']
});

/**
 * Tab button within a tab container.
 */
RESTEasy.TabButtonComponent = Ember.Component.extend({
    tagName: 'button',
    classNames: ['tab'],
    classNameBindings: ['active'],
    active: function() {
        return this.get('parentView.activeTab') == this.get('name');
    }.property('parentView.activeTab'),
    click: function() {
        this.set('parentView.activeTab', this.get('name'));
    }
});

/**
 * Tab content within a tab container.
 */
RESTEasy.TabContentComponent = Ember.Component.extend({
    classNames: ['content'],
    classNameBindings: ['active'],
    active: function() {
        return this.get('parentView.activeTab') == this.get('name');
    }.property('parentView.activeTab')
});
