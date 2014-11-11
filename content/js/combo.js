/*********************************
 *     Combo Box Replacement     *
 * Copyright 2014 - Nathan Osman *
 *********************************/

$(function() {

    // Find all of the combo boxes on the page and initialize them
    $('select').each(function() {

        // Create the new control
        var $select = $(this),
            $container = $('<div>').addClass('combo'),
            $button = $('<button>').appendTo($container),
            $menu = $('<ul>').addClass('menu').appendTo($container);

        // Close the menu
        function close() {
            $menu.slideUp('fast');
            $(document).off('click', close);
        }

        // Create each item in the combo
        $('option', this).each(function() {

            var name = $(this).text(),
                $item = $('<li>').text(name);

            // Set the click handler for the item
            $item.click(function() {
                $button.text(name);
                close();
            });

            // Append the item to the menu
            $menu.append($item);
        });

        // Select the first item
        $menu.children(':first').click();

        // When clicked, display the drop-down menu
        $button.click(function() {
            $menu.slideDown();
            $(document).on('click', close);
            return false;
        });

        // Replace the select with the new combo
        $select.replaceWith($container);
    });
});
