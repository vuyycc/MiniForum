const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const bcrypt = require('bcrypt')
const constants = require('../constants')
const mongoose = require('mongoose')
const path = require("path")

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        email: email
    })
    let checkPass = false
    if (user) {
        checkPass = bcrypt.compareSync(password, user.password)
    }
    if (user && checkPass) {
        const accessToken = jwt.sign({ email: user.email, _id: user._id, role: user.role }, process.env.SECRET_KEY);
        return res.json({
            accessToken
        })
    } else {
        return res.status(400).send({ err: 'Email or password incorrect' })
    }
})

//signup
router.post('/signup', async (req, res) => {
    const saltRound = 10
    let passwordHash = await bcrypt.hash(req.body.password, saltRound)
    req.body.password = passwordHash
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        address: req.body.address,
        age: req.body.age,
        userPost: req.body.userPost,
        avatar: 'uploads/user.png',
        role: req.body.role
    })
    const userExist = await User.findOne({
        email: req.body.email
    });
    if (userExist) {
        return res.status(400).send({ err: 'Email already exist' });
    }
    user.save((err) => {
        if (err) throw err;
        console.log("User save successfully");
    })
    res.json({ "data": user })
})

//upload avt
router.get('/uploads/:name', (req, res) => {
    const fileName = req.params.name;
    console.log('fileName', fileName);
    if (!fileName) {
        return res.send({
            status: false,
            message: 'no filename specified'
        })
    }
    res.sendFile(path.resolve(`../server/uploads/${fileName}`))
})

module.exports = router
