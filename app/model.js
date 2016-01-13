/**
 * Created by BERT on 3/01/16.
 */
var mongoose = require('mongoose');
var guid = require('node-uuid');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: {type: String, required: true},
    username: {type: String, required: true},
    password:{type: String, required: true},
});

UserSchema.pre('save', function(next){
    uid= guid.v1();
    this._id = uid;
    if(!this._id){
        this._id = uid
    }
})
//uuid.v1();

module.exports = mongoose.model('Geo-user', UserSchema);