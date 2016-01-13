/**
 * Created by Jochim on 13/01/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var checkInSchema = new Schema({
    username: {type: String, required: true},
    timestamp: {type:Date, default: Date.now},
    coordinates: {type: [Number], required: true},
    location: {type:String, required:true},
    isHappy: {type:Boolean, required:true},
    motivation: String
});

module.exports = mongoose.model('Geo-checkIn', checkInSchema);