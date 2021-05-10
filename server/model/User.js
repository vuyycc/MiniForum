var mongoose = require('mongoose')
var userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        require: true
    },
    
    address:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    avatar:{
        type: String,
        required: true
    }
})

var User = mongoose.model('User', userSchema)
module.exports = User
