/*
 * autocomplete.js - Simple jQuery / Bootstrap autocomplete plugin
 * Copyright 2013 - Nathan Osman
 */

$.fn.autocomplete = function(items) {

    // Initialize each of the controls in the matched set
    this.each(function() {

        // Grab a copy of the control and create the menu
        var control = $(this),
            menu    = $('<ul class="dropdown-menu"></ul>');

        // Filters the list of items displayed
        function filter() {

            var text    = control.val(),
                matched = [];

            // For each item, see if it matches
            $.each(items, function(i, item) {

                // Create lowercase copies for comparision
                var item_lower = item.toLowerCase(),
                    text_lower = text.toLowerCase();

                // Add the item if it is a match
                if(item_lower.indexOf(text_lower) === 0 && item_lower != text_lower)
                    matched.push(item);

                // Quit if we have five items
                if(matched.length == 5)
                    return false;
            });

            return matched;
        }

        // Displays the menu if there are any items
        function show() {

            // Determine how many items match and abort if none or single match
            var matched = filter();
            if(!matched.length) {

                // Hide the menu and do nothing
                menu.hide();
                return;
            }

            // Clear the list and append the matching items
            menu.empty();
            $.each(matched, function(i, item) {

                // Create the link and append it to the menu
                var link = $('<a href="#"></a>').text(item).mousedown(function() {

                    control.val(item);
                });
                menu.append($('<li></li>').append(link));
            });

            // Position the menu and show it
            var offset = control.offset();
            menu.css({
                'left': offset.left + 'px',
                'top':  (offset.top + control.outerHeight()) + 'px'
            }).show();
        }

        // Display the menu when the control is focused and a key is pushed
        control.focus(show).keyup(show).blur(function() {

            // Hide the menu
            menu.hide();
        })

        // Append the menu to the page
        $('body').append(menu);
    });

    return this;
};
