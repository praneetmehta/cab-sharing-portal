var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({

    user: {
        type: String,
        unique: true
    }
}, {
    collection: 'userinfo'
});



module.exports = mongoose.model('session', sessionSchema);
