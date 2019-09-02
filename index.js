// Import packages
var express = require('express');
var figlet = require('figlet');

// Import module
var api = require('./api');

var app = express();

// Prevent favicon error
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Api router
app.use('/', api);

// Start the express app
app.listen(3000, function() {
    figlet('Stock API', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        console.log('Node app is running on port 3000');
    });
});