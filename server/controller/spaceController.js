const express = require('express');
const router = express.Router();
const Space = require('../model/Space');
const Post = require('../model/Post')

router.get('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: "not found id" })
    }
    const id = { _id: req.params.id }
    await Space.findById(id).populate('list_posts').then(listPost => {
        res.json(listPost)
    })
    res.json(spaces)
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

router.get('/pages/:page',(req, res, next) => {
    let perPage = 6;
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


module.exports = router;

