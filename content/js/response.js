/*
 * response.js - Generates content for the response tabs
 * Copyright 2013 - Nathan Osman
 */

function Response(request) {

    var NS_XUL = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

    // Appends the contents of the headers tab
    this.appendHeaders = function(root) {

        root.append('<h4>Status</h4>')
            .append($('<p class="status"></p>').text(request.status + ' ' + request.statusText))
            .append('<br><h4>Headers</h4>');

        // Create the table for displaying headers
        var table = $('<table class="table table-striped"></table>')
            .append('<tr><th>Name</th><th>Value</th></tr>')

        // Split the headers
        var headers = request.getAllResponseHeaders().split('\n');
        $.each(headers, function(i, header) {

            var split = header.indexOf(':');
            if(split != -1)
                table.append($('<tr></tr>').append($('<td></td>').text(header.substr(0, split)))
                                           .append($('<td></td>').text(header.substr(split + 1))));
        });

        // Append the table
        root.append(table);
    };

    // Appends the contents of the raw tab
    this.appendRaw = function(root) {

        root.append($('<pre></pre>').text(request.responseText));
    };

    // Appends the contents of the preview tab
    this.appendPreview = function(root) {

        var iframe = document.createElementNS(NS_XUL, 'iframe');
        iframe.setAttribute('type', 'content');
        root.append(iframe);

        // Insert the HTML
        $(iframe).attr('src', 'data:text/html,' + encodeURIComponent(request.responseText));
    };
}
