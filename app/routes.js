var mongoose        = require('mongoose');
var User            = require('./models/user.js');
var Checkin         = require('./models/checkIn.js');

/*module.exports = function(app) {
    app.get('/users', function(req, res){
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);
            res.json(users);
        });
    });

    app.post('/users', function(req, res){
        var newUser = new User(req.body);
        newUser.save(function(err){
            if(err)
                res.send(err);
            res.json(req.body);
        });
    });
};
 */
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });
    app.get('/checkins', function(req,res){
        var query = Checkin.find({});
        query.exec(function(err,checkins){
            if(err)
                res.send(err);
            res.json(checkins);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(req.body);
        console.log("we got here: " + newuser);

        // New User is saved in the db.
        newuser.save(function(err){
            console.log("in save function");
            if(err) res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            console.log("we got even further");
            res.json(req.body);

        });
    });

    app.post('/checkins', function(req,res){
       var newcheckin = new Checkin(req.body);
        console.log("we got here: " + newcheckin);

        // New User is saved in the db.
        newcheckin.save(function(err){
            console.log("in save function");
            if(err) res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            console.log("we got even further");
            res.json(req.body);

    });


    // Save a checkin
});
}