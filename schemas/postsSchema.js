var mongoose = require('mongoose');

var postsSchema = new mongoose.Schema({
    cab: String,
    time: String,
    dateOfJourney: String,
    name: String,
    space: Number,
    contact: Number
}, {
    collection: 'cabinfo'
});

var cabinfo = mongoose.model('cabinfo', postsSchema);

module.exports = cabinfo;
