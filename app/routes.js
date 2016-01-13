var mongoose        = require('mongoose');
var User            = require('./models/user.js');
var checkin         = require('./models/checkIn.js');
var friend          = require('./models/Friends.js');
var express         = require('express');
var jwt             = require('jsonwebtoken');
var bodyParser      = require('body-parser')

module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    //This method must NOT be authenticated
    app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(JSON.parse(req.body));
        //console.log("we got here: " + newuser);

        // New User is saved in the db.
        newuser.save(function(err){
            //console.log("in save function");
            if(err) {res.send(err);}

            // If no errors are found, it responds with a JSON of the new user
            //console.log("we got even further");
            res.json(req.body);

        });
    });



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
            //verify secret
            jwt.verify(token, 'secretKey', function(err,decoded){
                if(err){
                    return res.json({succes:false, message: 'Failed to authenticate token.'});
                } else{
                    req.decoded = decoded;
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
    app.get('/api/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });




    // Save a checkin according to app/models/checkIn
    app.post('/api/checkin', function(req, res){
        console.log("got here");
        // Creates a new User based on the Mongoose schema and the post bo.dy
        var checkIn = new checkin(JSON.parse(req.body));

        checkIn.save(function(err){
            //console.log("in save function");
            console.log(err);
            if(err) res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);

        });
    });

    //delete a check in as an admin (rolecheck later)
    app.post('/api/checkout', function(req,res){
        checkin.findOne({
            username:req.body.username,
            timestamp: req.body.timestamp
        }, function(err, checkin){
            if(err) res.send(err);
            checkin.remove();
            res.json({succes:true});
        })


    });

    //Get checkins between two datetimes
    //if i get to it, difficult to do


    //get checkins from name
    app.post('/api/checkinsbyname', function(req,res) {
        checkin.find({
            username: JSON.parse(req.body)['username']
        }, function (err, checkin) {
            if (err) res.send(err);
            res.json(checkin);
        });
    });


    //get checkins from location
    app.post('/api/checkinsbylocation', function(req,res) {
        checkin.find({
            location: JSON.parse(req.body)['location']
        }, function (err, checkin) {
            if (err) res.send(err);
            res.json(checkin);
        });
    });


    //Add a friendship
    app.post('/api/friends', function(req, res){
        var newFriendship = new friend(JSON.parse(req.body));
        newFriendship.save(function(err){
            if(err) {res.send(err);}
            // If no errors are found, it responds with a JSON of the new friendship
            res.json(req.body);
        });
    });



    //Get friends
    app.post('/api/friends', function(req,res){
        var query = friend.find({
            _id : JSON.parse(req.body)['_id']
        });
        query.exec(function(err, friends){
            if(err) res.send(err)
            res.json(friends);
        })
    });

    //get user by id
    app.post('/api/userbyid', function(req,res) {
        User.find({
            _id: JSON.parse(req.body)['_id']
        }, function (err, user) {
            if (err) res.send(err);
            res.json(user);
        });
    });


    app.use(apiRoutes);
};