var mongoose = require('mongoose')

var postSchema = mongoose.Schema({
    title: String,
    imgVideo: String,
    described: String,
    like: Array,
    comment: Array,
    space: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
})

var Post = mongoose.model('Post',postSchema)
module.exports = Post;