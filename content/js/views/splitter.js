/**
 * REST Easy - A simple REST client for Firefox
 * Copyright 2015 - Nathan Osman
 **/

// View for the splitter dividing the two panes
RESTEasy.SplitterView = Ember.View.extend({
    classNames: ['splitter'],

    // Setup the event handlers for the splitter
    didInsertElement: function() {
        var $splitter = this.$(),
            $pane = $splitter.prev();

        $splitter.mousedown(function(e) {
            e.preventDefault();

            // Capture the initial width of the pane and position of the mouse
            // relative to the document
            var paneW = $pane.width(),
                pageX = e.pageX;

            function mouseMove(e) {
                $pane.width(paneW - (pageX - e.pageX));
            }

            function mouseUp() {
                $(document).off('mousemove', mouseMove);
            }

            // Bind the handlers until the mouse button is released
            $(document).on('mousemove', mouseMove);
            $(document).one('mouseup', mouseUp);
        });
    }
});
