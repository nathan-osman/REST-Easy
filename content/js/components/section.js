/**
 * REST Easy - A simple REST client for Firefox
 * Copyright 2015 - Nathan Osman
 **/

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
