var RestEasy = function() {
    
    // Utility methods to look up values
    function getUrl()    { return $('#url').val(); }
    function getMethod() { return $('input[name=options]:checked').val(); }
    
    // Sets the request headers
    function setRequestHeaders(req) {
        
        $('#request-headers tr.h').each(function(i, e) {
            
            h = $(e).find('td');
            req.setRequestHeader($(h[0]).text(), $(h[1]).text());
        });
    }
    
    // Toggles progress display
    function showProgress(show) {
        
        if(show) {
            $('#response').hide();
            $('#progress').show();
        } else {
            $('#progress').hide();
            $('#response').show();
        }
    }
    
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
    
    // Generates the HTML for the raw tab
    function generateRawTab(req) {
        
        function escape(html) {
            return html.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;');
        }
        
        return '<pre>' + escape(req.responseText) + '</pre>';
    }
    
    // Generates the HTML for the preview tab
    function generatePreviewTab(req) {
        
        return '[TODO]';
    }
    
    // Loads options into the form controls
    function loadOptions() {
        
        //...
    }
    
    // Saves options from the form controls
    function saveOptions() {
        
        //...
    }
    
    // Issues the request
    $('#send').click(function() {
        
        var req = new XMLHttpRequest();
        req.open(getMethod(), getUrl());
        setRequestHeaders(req);
        
        req.onreadystatechange = function() {
            
            if (req.readyState == 4) {
                
                $('#headers').html(generateHeadersTab(req));
                $('#raw')    .html(generateRawTab(req));
                $('#preview').html(generatePreviewTab(req));
                
                showProgress(false);
            }
        };
        
        req.send();
        showProgress(true);
    });
    
    $('#add-header').click(function() {
        
        $('<tr class="h"><td>' + $('#request-header-name').val() + '</td><td>' + $('#request-header-value').val() + '</td><td></td></tr>').insertBefore('#request-headers tr:last');
    });
};

// Initialize everything as soon as the DOM loads
$(document).ready(function() {
    new RestEasy();
});
