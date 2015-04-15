/**
 * REST Easy - A simple REST client for Firefox
 * Copyright 2015 - Nathan Osman
 **/

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
