var mongoose        = require('mongoose');
var Checkin            = require('./model.js');

module.exports = function(app) {
    app.get('/checkins', function(req, res){
        var query = Checkin.find({});
        query.exec(function(err, checkins){
            if(err)
                res.send(err);
            res.json(users);
        });
    });

    app.post('/checkins', function(req, res){
        var newcheckin = new Checkin(req.body);
        newcheckin.save(function(err){
            if(err)
                res.send(err);
            res.json(req.body);
        });
    });
};