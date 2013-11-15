/*
 * mapinput.js - HTML interface to an associative array
 * Copyright 2013 - Nathan Osman
 */

function MapInput(root) {
    
    // Map of all values currently stored
    var map = {};
    
    // Begin by constructing the table that will contain the map
    var table = $('<table class="table table-striped"></table>')
        .append('<tr><th>Name</th><th>Value</th><th></th></tr>');
    
    // Adds an item to the map
    function addItem(name, value) {
        
        if(!name.trim().length)
            return;
        
        if(name in map)
            map[name].text(value);
        else {
            var item_row = $('<tr></tr>')
                .append($('<td></td>').text(name))
                .append(map[name] = $('<td></td>').text(value));
            
            // Create the button that removes the item
            var remove = $('<button class="btn btn-sm btn-danger btn-block">Remove</button>')
                .prepend('<span class="glyphicon glyphicon-trash"></span> ')
                .click(function() {
                    
                    delete map[name];
                    item_row.remove();
                });
            
            // Add the button and insert the row into the table
            item_row.append($('<td></td>').append(remove))
                .insertBefore(table.find('tr:last'));
        }
    };
    
    // Create the form controls that will be used for inserting items
    var name  = $('<input type="text" class="form-control input-sm" placeholder="name">');
    var value = $('<input type="text" class="form-control input-sm" placeholder="value">');
    
    // Create the button that will be used to add items
    var add = $('<button class="btn btn-sm btn-default btn-block">Add</button>')
        .prepend('<span class="glyphicon glyphicon-plus"></span> ')
        .click(function() {
            
            addItem(name.val(), value.val());
            name.val('');
            value.val('');
        });
    
    // Insert the form controls
    var control_row = $('<tr></tr>')
        .append($('<td></td>').append(name))
        .append($('<td></td>').append(value))
        .append($('<td></td>').append(add));
    table.append(control_row);
    
    // Insert the table into the root element
    root.append(table);
    
    // Returns the data in the map
    this.get = function() {
        
        var ret = {};
        for(var name in map)
            ret[name] = map[name].text();
        return ret;
    };
    
    // Loads data into the map
    this.set = function(data) {
        
        for(var name in data)
            addItem(name, data[name]);
    };
}
