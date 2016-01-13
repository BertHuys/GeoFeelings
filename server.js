// Dependencies
// -----------------------------------------------------
var express = require('express');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();


// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
//mongoose.connect("mongodb://localhost/GeoFeelings/");
var mongoURI = "mongodb://dev:dev123@ds054118.mongolab.com:54118/mongofeelings";
var MongoDB = mongoose.connect(mongoURI).connection;
MongoDB.on('error', function(err) { console.log(err.message); });
MongoDB.once('open', function() {
    console.log("mongodb connection open");
});




// Logging and Parsing
app.use(express.static(__dirname + '/Frontend'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());


// Routes
// ------------------------------------------------------
require('./app/routes.js')(app);

// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);