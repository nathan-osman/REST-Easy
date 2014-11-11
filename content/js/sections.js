/*********************************
 *  Collapsible Section headings *
 * Copyright 2014 - Nathan Osman *
 *********************************/

$(function() {

    // Find all of the sections on the page and initialize them
    $('.section').each(function() {

        var $expand = $('h4 .expand', this),
            $content = $('.content', this);

        // Toggle the content when the button is clicked
        $expand.click(function() {

            $expand.toggleClass('expanded');
            $content.slideToggle();
        });
    });
});
