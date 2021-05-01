var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    name: String,
    age: String,
    avatar: String,
    address: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var User = mongoose.model('User', userSchema)
module.exports = User;