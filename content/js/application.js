/*********************************
 *  REST Easy Ember Application  *
 * Copyright 2014 - Nathan Osman *
 *********************************/

window.RESTEasy = Ember.Application.create();

/**
 * Main controller for the REST Easy application.
 * The actual sending of requests and receiving of responses takes place here.
 */
 RESTEasy.ApplicationController = Ember.Controller.extend({
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'LINK', 'UNLINK', 'OPTIONS'],
    method: 'GET',
    url: null,
    requestHeaders: [],
    username: null,
    password: null,
    actions: {
        send: function() {
            alert(this.get('method') + ' ' + this.get('url'));
        }
    }
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
 * View for examining a response.
 * Includes tabs for viewing response headers, previewing content, etc.
 */
RESTEasy.ResponseView = Ember.View.extend({
    templateName: 'app-response',
    classNames: ['response']
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

/**
 * Entry in a table.
 */
RESTEasy.TableEntry = Ember.Object.extend({
    name: null,
    value: null
});

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
            var o = RESTEasy.TableEntry.create({
                name: this.get('name'),
                value: this.get('value')
            })
            this.get('entries').pushObject(o);
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
