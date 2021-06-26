var mongoose = require('mongoose')

var spaceSchema = mongoose.Schema({
    name: String,
    list_posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    created: {
        type: Date,
        default: Date.now
    }
})

var Space = mongoose.model('Space', spaceSchema)
module.exports = Space;