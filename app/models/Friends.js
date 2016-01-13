/**
 * Created by Jochim on 13/01/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FriendSchema = new Schema({
    _id:String,
    friendId:String
});

module.exports = mongoose.model('Geo-friends', FriendSchema);