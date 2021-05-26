const express = require('express')
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt')
const Post = require('../model/Post')

router.post('/add-post', (req,res) => {
    let post = new Post(req.body)
    post.save((err) => {
        if (err) throw err;
        console.log('Post save successfully')
    })

    res.json({"message": "OK"})
})

router.get('/:id', async (req, res) => {
    const id = {_id: req.params.id}
    const post = await Post.findById(id).populate({path: 'author'})
    res.json({
        "message": "OK",
        "data": post
    })
})

router.put('/:id', (req, res) => {
    if(!req.params.id) {
        res.status(400).send({messError: 'not found id'})
    }
    const id = {_id: req.params.id}
    const update = req.body;
    Post.findByIdAndUpdate(id, update, {new: true}, function (err, result) {
        if (err) return res.send(err)
        res.json(result)
    })

})

router.delete('/:id', (req, res) => {
    if(!req.params.id) {
        res.status(400).send({messError: "not found id"})
    }

    const id = {_id: req.params.id}
    Post.findByIdAndDelete(id, function (err, result) {
        if(err) return res.send(err)
        res.json({
            mess: "Sucessful delete id:" + req.params.id
        })
    })
})

module.exports = router