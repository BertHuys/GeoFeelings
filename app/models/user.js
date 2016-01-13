/**
 * Created by BERT on 3/01/16.
 */
var mongoose = require('mongoose');
var guid = require('node-uuid');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: String,
    username: {type: String, required: true},
    password:{type: String, required: true},
    admin: Boolean,
    timestamp: {type:Date, default: Date.now},
    isChatty: Boolean
});

UserSchema.pre('save', function(next){
    uid= guid.v1();
    this._id = uid;
    next();
})

module.exports = mongoose.model('Geo-user', UserSchema);