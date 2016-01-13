var mongoose        = require('mongoose');
var User            = require('./models/user.js');
var checkin         = require('./models/checkIn.js');
var friend          = require('./models/Friends.js');
var express         = require('express');
var jwt             = require('jsonwebtoken');

module.exports = function(app) {
    var apiRoutes = express.Router();

    //API routes
    // get an instance of the router for api routes

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    //Expect json user with username and password
    app.post('/authenticate', function(req, res) {

        // find the user
        User.findOne({
            username: req.body.username
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, 'secretKey', {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        token: token
                    });
                }

            }

        });
    });

    app.use(function(req,res,next){

        //Check for token
        var token = req.get("x-access-token");

        //decode token
        if(token){
        console.log('past the if');
            //verify secret
            jwt.verify(token, 'secretKey', function(err,decoded){
                if(err){
                    return res.json({succes:false, message: 'Failed to authenticate token.'});
                } else{
                    req.decoded = decoded;
                    console.log('decoded: ' + decoded);
                    next();
                }
            });
        } else{

            //no token, return error
            return res.status(403).send({
                succes:false,
                message: 'No token provided'
            });
        }
    });


    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    //use /api/users?token=.... with the token from header[x-acces-token]
    app.get('/api/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        console.log('got into get');
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(req.body);
        //console.log("we got here: " + newuser);

        // New User is saved in the db.
        newuser.save(function(err){
            //console.log("in save function");
            if(err) res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            //console.log("we got even further");
            res.json(req.body);

        });
    });


    // Save a checkin
    app.post('/checkin', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var checkIn = new checkin(req.body);

        checkIn.save(function(err){
            //console.log("in save function");
            if(err) res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);

        });
    });

    app.use(apiRoutes);
};