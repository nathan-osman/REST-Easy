/**
 * REST Easy - A simple REST client for Firefox
 * Copyright 2015 - Nathan Osman
 **/

// Editable table for simple name/value storage
RESTEasy.EditableTableComponent = Ember.Component.extend({
    tagName: 'table',
    classNames: ['table'],

    // Translations for attributes
    trName: tr('table.name'),
    trValue: tr('table.value'),
    trRemove: tr('table.remove'),
    trSave: tr('table.save'),
    trAdd: tr('table.add'),

    actions: {
        add: function() {
            var name = this.get('name'),
                value = this.get('value');
            // Don't add anything unless both fields are filled in
            if(name && value) {
                this.get('entries').pushObject(
                    Ember.Object.create({
                        editing: false,
                        name: name,
                        value: value
                    })
                );
                this.set('name', '');
                this.set('value', '');
            }
        },
        edit: function(o) {
            o.set('editing', true);
        },
        save: function(o) {
            o.set('editing', false);
        },
        remove: function(o) {
            this.get('entries').removeObject(o);
        }
    }
});
