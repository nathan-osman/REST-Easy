/**
 * REST Easy - A simple REST client for Firefox
 * Copyright 2015 - Nathan Osman
 **/

// Register a helper to aid in translation
(function() {
    Components.utils.import('resource://gre/modules/Services.jsm');
    var bundle = Services.strings.createBundle('chrome://resteasy/locale/resteasy.properties');

    // Create the 'tr' function and register it as a helper
    var tr = window.tr = function(name) {
        return bundle.GetStringFromName(name);
    }
    Ember.Handlebars.registerBoundHelper('tr', tr);
})();
