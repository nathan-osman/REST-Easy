/**
 * REST Easy - A simple REST client for Firefox
 * Copyright 2015 - Nathan Osman
 **/

// View for setting request
RESTEasy.RequestView = Ember.View.extend(Ember.ViewTargetActionSupport, {
    templateName: 'app-request',
    classNames: ['pane', 'first'],

    // Set keyboard shortcut for firing request
    didInsertElement: function() {
        var self = this;
        this.$('input.url').on('keypress', null, 'return', function() {
            self.triggerAction({action: 'send'});
        });
    },

    // Form data controls should be displayed?
    dmForm: function() {
        return this.get('controller.dataMode') === DM_FORM;
    }.property('controller.dataMode'),

    // Custom data controls should be displayed?
    dmCustom: function() {
        return this.get('controller.dataMode') === DM_CUSTOM;
    }.property('controller.dataMode')
});
