const express = require('express');
const router = express.Router();
const Post = require('../model/Post')
const Comment = require('../model/Comment')

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

router.post('/', (req, res) => {
    let comments = new Comment(req.body)
    comments.save((err) => {
        if (err) throw err;
        console.log('Comment save successfully')
    })
    res.json({ "data": comments })
})

router.put('/set_comment/:id', async (req, res) => {
    try {
        var post = await Post.findById({ _id: req.params.id }).exec();
        res.json(post)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).send({messError: 'not found id'})
    }
    const id = {_id: req.params.id}

    Comment.findByIdAndDelete(id, function (err, docs) {
        if(err) {
            console.log(err)
        }
        else {
            res.json({mess: "Sucess delete id: " + req.params.id})
        }
    })
})

module.exports = router