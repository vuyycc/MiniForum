const express = require('express');
const router = express.Router();
const Space = require('../model/Space');
const Post = require('../model/Post')

// router.get('/:id', async (req, res) => {
//     if (!req.params.id) {
//         res.status(400).send({ messError: "not found id" })
//     }
//     const id = { _id: req.params.id }
//     await Space.findById(id).populate([{ path: 'list_posts', populate: [{ path: 'author', select: 'name' }, { path: 'comment', populate: { path: 'author', select: 'name'}}]}]).then(listPost => {
//         res.json(listPost)
//     })
//     res.json(spaces)
// })

router.get('/:id', async (req,res,next) => {
    let perPage = 6;
    let id = req.params.id
    let page = req.params.page || 1;
    let i = (perPage * page) - perPage;
    let max = i + perPage;

    await Space.findById(id)
        .populate([{ path: 'list_posts', populate: [{ path: 'author', select: 'name' }, { path: 'comment', populate: { path: 'author', select: 'name' } }] }])
        .exec((err, posts) => {
            let arrPost = []
            let lengthx = posts.list_posts.length;
            let count = Math.ceil(lengthx / perPage)
            for (i; i < max && i < posts.list_posts.length ; i++) {
                arrPost.push(posts.list_posts[i])
            }
            posts.list_posts = arrPost
            res.json({
                "data": posts,
                "current": page,
                "pages": count
            })
        })
})

//get space by page
router.get('/spaces/:id/:page',async (req,res, next) => {
    let perPage = 6;
    let id = req.params.id
    let page = req.params.page || 1;
    let i = (perPage * page) - perPage;
    let max =i + perPage;

    await Space.findById(id)
        .sort({ created: -1 })
        .populate([{ path: 'list_posts', populate: [{ path: 'author', select: 'name' }, { path: 'comment', populate: { path: 'author', select: 'name' } }] }])
        .exec((err, posts) => {
            let arrPost = []
            let lengthx = posts.list_posts.length;
            let count = Math.ceil(lengthx / perPage)
            for(i; i < max && i < posts.list_posts.length; i++){
                arrPost.push(posts.list_posts[i])
            }
            posts.list_posts = arrPost 
            res.json({
                "data": posts,
                "current": page,
                "pages": count
            })
        })
})

router.get('/', (req, res) => {
    //let authId= req.authenticateUser._id
    //if(authId){
    return Space.find().exec((err, spaces) => {
        if (err) throw err
        res.json(spaces)

    })
    //}
})



router.post('/add', (req, res) => {
    let space = new Space({
        name: req.body.name,
        list_spaces: req.body.list_spaces,

    })
    space.save((err) => {
        if (err) throw err;
        console.log('space save');
    })
    res.json(space)
})

//get post by page
router.get('/pages/:page',(req, res, next) => {
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
                    "pages": Math.ceil(count/perPage)
                })
            })
        })
})

//search value

router.get('/search-title/:value', async (req, res) => {
    let value = req.params.value.toLowerCase()
    await Post.find().populate([{ path: 'author', select: ['name', 'avatar'] }, { path: 'like', select: ['name', 'avatar'] }, { path: 'comment', populate: { path: 'author', select: ['name', 'avatar'] } }])
        .exec((err, posts) => {
            let arrPost = []
            for(let i = 0; i < posts.length ; i++){
                if(posts[i].title.toLowerCase().includes(value)){
                    arrPost.push(posts[i])
                }
            }          
                res.json({
                    "data": arrPost
                })
        })
})

router.get('/search-author/:value', async (req, res) => {
    let value = req.params.value.toLowerCase()
    await Post.find().populate([{ path: 'author', select: ['name', 'avatar'] }, { path: 'like', select: ['name', 'avatar'] }, { path: 'comment', populate: { path: 'author', select: ['name', 'avatar'] } }])
        .exec((err, posts) => {
            let arrPost = []
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].author.name.toLowerCase().includes(value)) {
                    arrPost.push(posts[i])
                }
            }
            res.json({
                "data": arrPost
            })
        })
})


router.get('/post/top/1', async (req,res) => {
    await Post.find().populate([{ path: 'author', select: ['name', 'avatar'] }, { path: 'like', select: ['name', 'avatar'] }, { path: 'comment', populate: { path: 'author', select: ['name', 'avatar'] } }])
        .exec((err, posts) => {
            res.json(posts)
        })
})

module.exports = router;

