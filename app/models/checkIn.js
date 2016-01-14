/**
 * Created by Jochim on 13/01/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var checkInSchema = new Schema({
    username: {type: String, required: true},
    timestamp: {type:Date, default: Date.now},
    mood:{type:String,required:true},
    location: {type: [Number], required: true},
    place: String,
    motivation: String
});

module.exports = mongoose.model('Geo-checkIn', checkInSchema);