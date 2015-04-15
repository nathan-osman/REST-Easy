/**
 * REST Easy - A simple REST client for Firefox
 * Copyright 2015 - Nathan Osman
 **/

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
