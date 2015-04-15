/**
 * REST Easy - A simple REST client for Firefox
 * Copyright 2015 - Nathan Osman
 **/

// View for setting request
RESTEasy.RequestView = Ember.View.extend(Ember.ViewTargetActionSupport, {
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
