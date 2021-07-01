const express = require('express')
const router = express.Router();
const Post = require('../model/Post')
const mongoose = require('mongoose')
const Comment = require('../model/Comment')
const constants = require('../constants')
const Space = require('../model/Space');
const User = require('../model/User');
// New Post

router.post('/add-post', constants.upload.single('imgVideo'), async (req, res) => {
    const authId = req.authenticateUser._id
    let post = new Post({
        _id: new mongoose.Types.ObjectId,
        title: req.body.title,
        imgVideo: req.file?.path,
        described: req.body.described,
        like: [],
        comment: [],
        space: req.body.space,
        author: req.body.author
    })
    console.log(post._id);
    if (authId) {
        await post.save((err) => {
            if (err) throw err;
            console.log('Post save successfully')
            Space.findByIdAndUpdate(post.space, {
                $push: { list_posts: post._id }
            }, { new: true }).exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })
                }
            })
            User.findByIdAndUpdate(post.author, {
                $push: { userPost: post._id }
            }, { new: true }).exec((err) => {
                if (err) {
                    return res.status(422).json({ error: err })
                }
            })
            //})} else {
            // res.status(400).send({messError:'You must login '})
            //}
        }
        )

        res.json({ "data": post })
    }
    else {
        res.status(400).send({ messError: 'You must login ' })
    }
})


//Add Comment

router.post('/:id', async (req, res) => {
    const authId = req.authenticateUser._id
    let comments = new Comment({
        _id: new mongoose.Types.ObjectId(),
        content: req.body.content,
        author: authId
    })
    const id = { _id: req.params.id }
    if (authId) {
        comments.save((err) => {
            if (err) throw err;
            console.log('Comment save successfully')
        })
        Post.findByIdAndUpdate(id, {
            $push: { comment: comments._id }
        }, { new: true }).exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
        })
    } else {
        res.status(400).send({ messError: 'You must login ' })
    }
})

//Like

router.post('/like/:id', async (req, res,) => {
    let id = { _id: req.params.id }
    const authId = req.authenticateUser._id
    if (authId) {
        let body = {
            _id: req.body._id
        }
        Post.findByIdAndUpdate(id, {
            $push: { like: body._id }
        }, { new: true }).exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
    }
})

//unLike

router.post('/unlike/:id', (req, res) => {
    const authId = req.authenticateUser._id
    Post.findByIdAndUpdate(req.params.id, {
        $pull: { like: authId }
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
// Get Post by Id
router.get('/:id', async (req, res, next) => {
    let perPage = 10
    let id = req.params.id
    let page = req.params.page || 1
    let i = (perPage * page) - perPage
    let max = i + perPage;
    if (!id) {
        res.status(400).send({ messErr: 'not found id' })
    } else {
        await Post.findById(id).populate([{ path: 'author', select: ['name', 'avatar', 'userPost', 'role'] }, { path: 'like', select: ['name', 'avatar'] }, { path: 'comment', populate: { path: 'author', select: ['name', 'avatar', 'userPost', 'role'] } }, { path: 'space', select: 'name' }])
            .exec((err, posts) => {
                let arrPost = []
                let lengthx = posts.comment.length;
                let count = Math.ceil(lengthx / perPage)
                for (i; i < max && i < lengthx; i++) {
                    arrPost.push(posts.comment[i])
                }
                posts.comment = arrPost

                res.json({
                    "data": posts,
                    "current": page,
                    "pages": count
                })
            })
    }
})

//get comment by page
router.get('/:id/:page', async (req,res,next) => {
    let perPage = 10
    let id = req.params.id
    let page = req.params.page || 1
    let i = (perPage*page) - perPage
    let max = i + perPage;
    if(!id) {
        res.status(400).send({messErr: 'not found id'})
    }else {
        await Post.findById(id).populate([{ path: 'author', select: ['name', 'avatar', 'userPost', 'role'] }, { path: 'like', select: ['name', 'avatar'] }, { path: 'comment', populate: { path: 'author', select: ['name', 'avatar', 'userPost', 'role'] } }, { path: 'space', select: 'name' }])
        .exec((err, posts) => {
            let arrPost = []
            let lengthx = posts.comment.length;
            let count = Math.ceil(lengthx / perPage)
            for (i; i < max && i < lengthx; i++) {
                arrPost.push(posts.comment[i])
            }
            posts.comment = arrPost
            
            res.json({
                "data": posts,
                "current": page,
                "pages": count
            })
        })
    }
})
//Get all Post
// router.get('/', (req, res) => {
//     return Post.find().populate([{ path: 'author', select: ['name', 'avatar'] }, { path: 'like', select: ['name', 'avatar'] }, { path: 'comment', populate: { path: 'author', select: ['name', 'avatar'] } }]).exec((err, posts) => {
//         if (err) throw err
//         res.json(posts)
//     })
// })
router.get('/', (req, res, next) => {
    let perPage = 10;
    let page = req.params.page || 1;
    Post.find()
        .sort({ created: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate([{ path: 'author', select: ['name', 'avatar'] }, { path: 'like', select: ['name', 'avatar'] }, { path: 'comment', populate: { path: 'author', select: ['name', 'avatar'] } }])
        .exec((err, posts) => {
            Post.countDocuments((err, count) => {
                if (err) throw err;
                res.json({
                    "data": posts,
                    "current": page,
                    "pages": Math.ceil(count / perPage)
                })
            })
        })
})


//Update Post by Id
router.put('/:id', constants.upload.single('imgVideo'), (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: 'not found id' })
    }
    const authId = req.authenticateUser._id
    const id = { _id: req.params.id }
    if (authId) {
        const update = {
            _id: id,
            title: req.body.title,
            imgVideo: req.file.path,
            described: req.body.described,
            space: req.body.space,
        }
        Post.findByIdAndUpdate(id, update, { new: true }, function (err, result) {
            if (err) return res.send(err)
            res.json(result)
        })
    } else {
        res.status(400).send({ messError: 'You must login ' })
    }
})
//Delete Post
router.delete('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: "not found id" })
    }
    const id = { _id: req.params.id }
    const currentPost = await Post.findById(id)
    let authId = req.authenticateUser._id
    let role = req.authenticateUser.role
    //if (currentPost.author === authId || role === 'admin') {
        User.findByIdAndUpdate(currentPost.author, {
            $pull: { userPost: currentPost._id }
        }, {
            new: true
        }).exec((err) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
        })
        Space.findByIdAndUpdate(currentPost.space, {
            $pull: { list_posts: currentPost._id }
        }, {
            new: true
        }).exec((err) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
        })
        Post.findByIdAndDelete(id, function (err, result) {
            if (err) return res.send(err)

            res.json({
                mess: "Sucessful delete id:" + req.params.id
            })

        })
    //}
})

router.post('/update/:id', (req, res) => {
    let body = {
        id: req.body._id
    }
    let id = { _id: req.params._id }
    Post.findByIdAndUpdate(id, {
        $pull: { comment: body._id }
    }, { new: true }).exec((err) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
    })
})



module.exports = router
