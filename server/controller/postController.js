const express = require('express')
const router = express.Router();
const Post = require('../model/Post')
const mongoose = require('mongoose')
const Comment = require('../model/Comment')
const constants = require('../constants')

router.post('/add-post', constants.upload.single('imgVideo'), (req, res) => {
    let post = new Post({
        
        title: req.body.title,
        imgVideo: req.file.path,
        described: req.body.described,
        like: req.body.like,
        comment: req.body.comment,
        space: req.body.space,
        author:req.body.author
    })
    post.save((err) => {
        if (err) throw err;
        console.log('Post save successfully')
    })

    res.json({"data": post} )
})

//Add Comment

router.post('/:id', async (req, res) => {
    let comments = new Comment({
        _id: new mongoose.Types.ObjectId(),
        content: req.body.content,
        author: req.body.author 
    })
    comments.save((err) => {
        if (err) throw err;
        console.log('Comment save successfully')
    })
    let idPost = { _id: req.params.id}
    let nowPost = await Post.findById(idPost)
    nowPost.comment = nowPost.comment||[]
    const addUser = await nowPost.comment.push(comments._id)
    Post.findByIdAndUpdate(idPost, nowPost, { new: true }, function (err, result) {
        if (err) return res.send(err)
    })
    
    res.json({ "data": nowPost })
})

//Like

router.post('/like/:id',async (req,res,)=>{
    let id = {_id: req.params.id}
    const liked = {
        _id: req.body._id
    }
    var nowPost = await Post.findById(id)
    nowPost.like = nowPost.like||[]
    const addUser = await nowPost.like.push(liked)
    Post.findByIdAndUpdate(id, nowPost, { new: true }, function (err, result) {
        if (err) return res.send(err)
    })
    
    res.json({ "data": nowPost })

})

router.get('/:id', async (req, res) => {
    const id = { _id: req.params.id }
    if(!id){
        res.status(400).send({messErr:'not found id'})
    } else{
        const post = await (await Post.findById(id).populate([{path: 'author', select:['name','avatar']},{path:'like',select:['name','avatar']},{path:'comment',populate:{path:'author',select:['name','avatar']}}]))
    //const post = await (await Post.findById(id).populate([{path: 'author', select:['name','avatar']},'comment',{path: 'like', select:['name','avatar']}]))
    res.json({
        "message": "OK",
        "data": post
    })}
})

router.get('/', (req,res)=>{
    return Post.find().populate([{path: 'author', select:['name','avatar']},{path:'like',select:['name','avatar']},{path:'comment',populate:{path:'author',select:['name','avatar']}}]).exec((err,posts)=>{
        if(err) throw err
        res.json(posts)
    })
})

router.put('/:id',constants.upload.single('imgVideo') ,(req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: 'not found id' })
    }
    const id = { _id: req.params.id }
    const update = {
            _id: id,
            title: req.body.title,
            imgVideo: req.file.path,
            described: req.body.described,
            like: req.body.like,
            comment: req.body.comment,
            space: req.body.space,
            author:req.body.author
    }
    Post.findByIdAndUpdate(id, update, { new: true }, function (err, result) {
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
