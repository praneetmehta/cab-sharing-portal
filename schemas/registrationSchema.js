var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
});

var usermodel = mongoose.model('usermodel', userSchema);

module.exports = usermodel;
