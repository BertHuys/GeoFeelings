var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.PORT || 3000;
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();

mongoose.connect("mongodb://localhost/GeoFeelings/");


app.use(express.static(__dirname + '/Frontend'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());

require('../app/routes.js')(app);

// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);