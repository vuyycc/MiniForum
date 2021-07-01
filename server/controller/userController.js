const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../model/User')
const bcrypt = require('bcrypt')
const constants = require('../constants')
const path = require('path')

//Get all User
router.get('/all', (req, res) => {
    let role = req.authenticateUser.role
    console.log(role);
    if (role === "admin") {
        return User.find().populate({path:'userPost', select: ['like','comment'] }).exec((err, users) => {
            if (err) throw err
            res.json(users)
        })
    } else {
        res.status(400).send({ messError: 'You must be admin ' })
    }
})
//Get User by ID
router.get('/:id', (req, res) => {
    const id = { _id: req.params.id }


    if (!id) {
        res.status(400).send({ messError: 'not found id' })
    }

    User.findById(id).populate('userPost').exec((err, users) => {
        if (err) throw err
        res.json(users)
    })
})
//Update User
router.put('/update', constants.upload.single('avatar'), async (req, res) => {
    const authId = req.authenticateUser._id
    if (!authId) {
        res.status(400).send({ messError: 'not found ID' })
    }
    const update = {
        _id: req.body._id,
        name: req.body.name,
        address: req.body.address,
        age: req.body.age
    }
    User.findByIdAndUpdate(req.body._id, update, { new: true }, function (err, result) {
        if (err) return res.send(err)
        res.json(result)
        console.log("abc");
    })
})
//Delete User
router.delete('/:id', (req, res) => {
    const id = { _id: req.params.id }
    if (!id) {
        res.status(400).send({ messError: 'not found id' })
    }
    //if (req.authenticateUser.role == "admin") {
    User.findByIdAndDelete(id, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ mess: "Sucessesful delete id:" + req.params.id })
        }
    })
    //} else {
    //  res.status(400).send({ messError: 'You must be admin ' })
    //}
})

//Update avatar
router.post('/avatar', constants.upload.single('avatar'), (req, res) => {
    let authId = req.authenticateUser._id;
    let update = req.body;
    update.avatar = req.file.originalname
    User.findByIdAndUpdate(authId, update, { new: true }, function (err, result) {
        if (err) return res.send(err)
        res.json(result)
    });
})

//Update Password

router.post('/password', async (req, res) => {
    let authId = req.authenticateUser._id
    const saltRound = 10
    let newPasswordHash = await bcrypt.hash(req.body.newPassword, saltRound)
    let body = {
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword
    }
    body.newPassword = newPasswordHash
    let updatePassword = {
        password: body.newPassword
    }
    const currentUser = await User.findById(authId)
    checkPass = bcrypt.compareSync(body.currentPassword, currentUser.password)
    if (checkPass) {
        User.findByIdAndUpdate(authId, updatePassword, { new: true }, function (err, result) {
            if (err) return res.send(err)
            res.json(result)
        });
    } else {
        return res.status(400).send({ messError: 'abc' })
    }
})

// Update Role

router.post('/update-role', (req, res) => {
    let authRole = req.authenticateUser.role
    let body = {
        _id: req.body._id,
        role: req.body.role
    }
    if (authRole === 'admin') {
        User.findByIdAndUpdate(body._id.body, { new: true }, function (err, result) {
            if (err) return res.send(err)
            res.json(result)
        })
    } else {
        return res.status(400).send({ messError: 'You must be Admin' })
    }
})

module.exports = router
