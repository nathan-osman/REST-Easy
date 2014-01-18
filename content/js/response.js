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

        // Ensure that a valid MIME type was specified
        var mime  = request.getResponseHeader('Content-Type'),
            parts = (mime !== null)?mime.match(/^(.+)\/(.+?)(?:;|$)/):null;
        if(parts === null) {
            root.append($('<div class="alert alert-danger">Unable to read Content-Type HTTP header.</div>'));
            return;
        }

        // Any MIME type recognized in the list below is highlighted
        var highlight = {
            'application/javascript': 'sh_javascript',
            'application/json':       'sh_javascript',
            'text/html':              'sh_html',
            'text/xml':               'sh_xml'
        };

        // If it's a recognized type, assign the correct class
        var combined = parts[1] + '/' + parts[2];
        if(combined in highlight) {

            root.append($('<pre></pre>').text(request.responseText).addClass(highlight[combined]));

            // If the size of the content is > 10 KiB, then highlighting is manually applied
            if(request.responseText.length > 10240){

                var icon    = $('<span class="glyphicon glyphicon-ok"></span>'),
                    button  = $('<button class="btn btn-default btn-sm pull-right">Highlight Anyway</button>').prepend(icon),
                    warning = $('<div class="alert alert-warning">The response is larger than 10 KiB. ' +
                                'Syntax highlighting may take a long time.</div>').prepend(button);

                // Set the click handler for the button and append it to the root element
                button.click(function() {

                    warning.remove();
                    sh_highlightDocument();
                });
                root.prepend(warning);

            } else
                sh_highlightDocument();
        }
        // Anything else, we can still append as a simple <pre>
        else
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
