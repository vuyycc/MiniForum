var mongoose =require('mongoose');
const { model } = require('./Post');

var likeSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var Like = mongoose.model('Like', likeSchema)
module.exports = Like;