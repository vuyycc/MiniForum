var mongoose = require('mongoose')

var commentSchema = mongoose.Schema({
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
})

var Comment = mongoose.model('Comment',commentSchema)
module.exports = Comment;