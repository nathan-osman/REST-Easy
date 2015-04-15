/**
 * REST Easy - A simple REST client for Firefox
 * Copyright 2015 - Nathan Osman
 **/

// Pre that provides syntax-highlighting capabilities
RESTEasy.HighlightPreComponent = Ember.Component.extend({

    // Determine if the content type is text based
    textContentType: function() {
        var p = this.get('contentType').match(/([^\/]+)\/([^;]+)/),
            type = p && p[1],
            subtype = p && p[2];

        if(type === 'text')
            return true;
        else if(type === 'application' && (subtype == 'javascript' || subtype == 'json'))
            return true;
        return false;
    }.property('contentType'),

    // Watch for changes to the raw property
    rawChanged: function() {
        var raw = this.get('raw')

        this.$('pre').text(raw);

        // Highlight right away if the text is less than 10kb in size,
        // otherwise display a notice that highlighting may take a while
        if(raw.length < 10000) {
            this.send('highlight');
        } else {
            this.set('notice', true);
        }
    }.observes('raw').on('didInsertElement'),

    actions: {
        highlight: function() {
            hljs.highlightBlock(this.$('pre').get(0));
            this.set('notice', false);
        }
    }
});
