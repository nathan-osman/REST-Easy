/*********************************
 *  REST Easy Ember Application  *
 * Copyright 2014 - Nathan Osman *
 *********************************/

window.RESTEasy = Ember.Application.create();

/**
 * Request or response header.
 */
RESTEasy.Header = Ember.Object.extend({
    name: null,
    value: null
});

/**
 * Main controller for the REST Easy application.
 * The actual sending of requests and receiving of responses takes place here.
 */
 RESTEasy.ApplicationController = Ember.Controller.extend({
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'LINK', 'UNLINK', 'OPTIONS'],
    method: 'GET',
    url: null,
    requestHeaders: Ember.A(),
    actions: {
        send: function() {
            alert(this.get('method') + ' ' + this.get('url'));
        },
        header: function() {
            this.get('requestHeaders').pushObject(RESTEasy.Header.create({name: 'test1', value: 'test2'}));
        }
    }
 });

/**
 * View for issuing a request.
 * Includes controls for setting the request method, URL, headers, etc.
 */
RESTEasy.RequestView = Ember.View.extend({
    templateName: 'app-request'
});

/**
 * View for examining a response.
 * Includes tabs for viewing response headers, previewing content, etc.
 */
RESTEasy.ResponseView = Ember.View.extend({
    templateName: 'app-response'
})

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
