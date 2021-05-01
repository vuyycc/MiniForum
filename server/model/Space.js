var mongoose = require('mongoose')

var spaceSchema = mongoose.Schema({
    name: String,
    follow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    list_posts: Array,
    created: {
        type: Date,
        default: Date.now
    }
})