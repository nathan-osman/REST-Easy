/************************************
 * Splitter for Two Resizable Panes *
 *  Copyright 2014 - Nathan Osman   *
 ************************************/

$(function() {

    // Find all of the splitters on the page and initialize them
    $('.splitter').each(function() {

        var $splitter = $(this),
            $pane = $splitter.prev();

        $splitter.mousedown(function(e) {

            e.preventDefault();

            // Capture the initial width of the pane and position
            // of the mouse relative to the document
            var paneW = $pane.width(),
                pageX = e.pageX;

            function mouseMove(e) {
                $pane.width(paneW - (pageX - e.pageX));
            }

            function mouseUp() {
                $(document).off('mousemove', mouseMove);
                $(document).off('mouseup', mouseUp);
            }

            // Bind the event until the mouse button is released
            $(document).on('mousemove', mouseMove);
            $(document).on('mouseup', mouseUp);
        });
    });
});
