/*********************************
 *       Simple Tab Control      *
 * Copyright 2014 - Nathan Osman *
 *********************************/

$(function() {

    // Find all of the tab groups on the page and initialize them
    $('.tabs').each(function() {

        var $container = $(this);

        // Ensure the specified content is displayed when each tab is clicked
        $('.tab', $container).each(function() {

            var $tab = $(this),
                $content = $('#' + $tab.data('id'));

            $tab.click(function() {
                $('.tab,.content', $container).removeClass('active');
                $tab.add($content).addClass('active');
            });
        });
    });
});
