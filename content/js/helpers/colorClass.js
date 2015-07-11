Handlebars.registerHelper('colorClass', function() {
    var method = this.method;
    if (method === 'GET') return 'green';
    if (method === 'POST') return 'orange';
    return 'teal';
});
