const express = require('express');
const router = express.Router();
//const Post = require('../model/Post')
const Comment = require('../model/Comment');
const Post = require('../model/Post');
//Get comment by Id
router.get('/get_comment/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: 'Not found id' })
    }

    const id = { _id: req.params.id };
    const post = await Post.findById(id).populate({ path: 'comments', populate: { path: 'author' } })

    res.json({
        "meassage": "OK",
        "data": post.comments
    })

})

router.put('/set_comment/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: 'not found id' })
    }
    const id = { _id: req.params.id }
    let update = req.body
    Comment.findByIdAndUpdate(id, update, { new: true }, (err, result) => {
        if (err) return res.send(err)
        res.json(result)
    })
})


//Like

router.post('/like/:id', async (req, res,) => {
    Comment.findByIdAndUpdate(req.params.id, {
        $push: { like: req.body._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

//unLike

router.post('/unlike/:id', (req, res) => {
    Comment.findByIdAndUpdate(req.params.id, {
        $pull: { like: req.body._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

// Delete Comment
router.delete('/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: 'not found id' })
    }
    const id = { _id: req.params.id }
    Comment.findByIdAndDelete(id, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ mess: "Sucess delete id: " + req.params.id })
        }
    })
})

module.exports = router