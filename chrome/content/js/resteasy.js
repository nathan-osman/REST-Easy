/*
 * resteasy.js - Interactivity for the REST Easy addon
 * Copyright 2013 - Nathan Osman
 */

function RestEasy() {
    
    // Initialize the method dropdown
    var request_method = new Dropdown($('#request-method'), ['GET', 'POST', 'HEAD', 'PUT', 'DELETE']);
    
    // Initialize the MapInput controls
    var request_parameters = new MapInput($('#request-parameters-control'));
    var request_headers    = new MapInput($('#request-headers-control'));
    
    // Toggles progress display
    function showProgress(show) {
        
        if(show) {
            $('#response-tabs').hide();
            $('#response-progress').show();
        } else {
            $('#response-progress').hide();
            $('#response-tabs').show();
        }
    }
    
    /*
    // Generates the HTML for the headers tab
    function generateHeadersTab(req) {
        
        var html = '<h4>Details</h4><p><strong>Status:</strong> ' + req.status + ' ' + req.statusText + '</p><br>';
        var headers = req.getAllResponseHeaders().split('\n');
        
        html += '<h4>Headers</h4><table class="table table-striped"><tr><th>Name</th><th>Value</th></tr>';
        for(var i = 0; i < headers.length; ++i) {
            
            var split = headers[i].indexOf(':');
            if(split != -1)
                html += '<tr><td>' + headers[i].substr(0, split) + '</td><td>' + headers[i].substr(split + 1) + '</td></tr>';
        }
        html += '</table>';
        
        return html;
    }
    */
    
    // Issues the request
    $('#send').click(function() {
        
        var request = new XMLHttpRequest();
        request.open(request_method.get(), $('#url').val());
        
        var headers = request_headers.get();
        for(var name in headers)
            request.setRequestHeader(name, headers[name]);
        
        request.onreadystatechange = function() {
            
            if(request.readyState == 4) {
                
                var response = new Response(request);
                response.appendHeaders($('#response-headers'));
                response.appendRaw($('#response-raw'));
                response.appendPreview($('#response-preview'));
                
                showProgress(false);
            }
        };
        
        showProgress(true);
        $('#response-tabs .tab-pane').empty();
        
        request.send();
    });
};
