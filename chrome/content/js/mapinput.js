/*
 * map.js - HTML interface to an associative array
 * Copyright 2013 - Nathan Osman
 */

function MapInput(root) {
    
    // Map of all values currently stored
    var map = {};
    
    // Begin by constructing the table that will contain the map
    var table = $('<table class="table table-striped"></table>');
    table.append('<tr><th>Name</th><th>Value</th><th></th></tr>');
    
    // Adds an item to the map
    function addItem(name, value) {
        
        if(!name.trim().length || !value.trim().length)
            return;
        
        if(name in map)
            map[name].text(value);
        else {
            var item_row = $('<tr></tr>');
            item_row.append('<td>' + name + '</td>');
            item_row.append(map[name] = $('<td></td>').text(value));
            
            // Create the button that removes the item
            var remove = $('<button class="btn btn-sm btn-danger btn-block">Remove</button>');
            remove.prepend('<span class="glyphicon glyphicon-trash"></span> ');
            remove.click(function() {
                
                delete map[name];
                item_row.remove();
            });
            
            // Add the button and insert the row into the table
            item_row.append($('<td></td>').append(remove));
            item_row.insertBefore(table.find('tr:last'));
        }
    };
    
    // Create the form controls that will be used for inserting items
    var name  = $('<input type="text" class="form-control input-sm" placeholder="name">');
    var value = $('<input type="text" class="form-control input-sm" placeholder="value">');
    var add   = $('<button class="btn btn-sm btn-default btn-block">Add</button>');
    add.prepend('<span class="glyphicon glyphicon-plus"></span> ');
    
    // Set up the event handler for the add button
    add.click(function() {
        
        addItem(name.val(), value.val());
        name.val('');
        value.val('');
    });
    
    // Insert the form controls
    var control_row = $('<tr></tr>');
    control_row.append($('<td></td>').append(name));
    control_row.append($('<td></td>').append(value));
    control_row.append($('<td></td>').append(add));
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
        
        //...
    };
}
