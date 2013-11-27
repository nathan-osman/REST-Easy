/*
 * response.js - Generates content for the response tabs
 * Copyright 2013 - Nathan Osman
 */

function Response(request) {

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

        var iframe = $('<iframe></iframe>');
        root.append(iframe);

        var iwindow = iframe[0].contentWindow;
        iwindow.document.write(request.responseText);
        iwindow.document.close();

        // Hack to suppress the "loading" indicator when the page tries to load static files
        iwindow.stop();
    };
}
