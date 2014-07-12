/*
 * dropdown.js - Wrapper for button dropdowns
 * Copyright 2013 - Nathan Osman
 */

function Dropdown(button, items) {

    // Map of links and current selection
    var links = {};
    var selection;

    // Create the list that will contain the options
    var list = $('<ul class="dropdown-menu"></ul>');

    // Initialize each item in the list
    $.each(items, function(i, item) {

        var link = links[item] = $('<a href="#"></a>')
            .text(item)
            .click(function(e) {
                e.preventDefault();

                button.text(selection = item).append(' <span class="caret"></span>');
            });
        list.append($('<li></li>').append(link));
    });

    // Select the first item
    if(items.length)
        links[items[0]].click();

    // Insert the list after the button
    list.insertAfter(button);

    // Returns the currently selected item
    this.get = function() {

        return selection;
    };

    // Sets the currently selected item
    this.set = function(data) {

        links[selection].click();
    };
}
