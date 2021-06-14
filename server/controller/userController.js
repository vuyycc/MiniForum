const express = require('express')
const router = express.Router();
//const multer = require('multer');
const mongoose = require('mongoose')
const User = require('../model/User')
const bcrypt = require('bcrypt')
const constants = require('../constants')
/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 10000000
    },
    fileFilter: fileFilter
})*/


<<<<<<< HEAD

=======
//Create User
>>>>>>> f06b8575e825e2a47e1a33f66732fcf6973e1d8f
router.post('/',constants.upload.single('avatar'), async (req,res)=>{
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
        avatar: req.file.path,
        role: req.body.role
    })
    const userExist = await User.findOne({
        email: req.body.email
    });
    if (userExist) {
        return res.status(400).send({ err: 'Email already exist' });
    }
    user.save((err)=>{
        if(err) throw err;
        console.log("User save successfully");
    })
    res.json({"data": user})
})
//Get all User
router.get('/all',(req,res)=>{
    return User.find().exec((err, users)=>{
        if(err) throw err
        res.json(users)
    })
})
//Get User by ID
router.get('/:id', (req, res) => {
    const id = { _id: req.params.id }
    if (!id) {
        res.status(400).send({ messError: 'not found id' })
    }

    User.findById(id).exec((err, users) => {
        if (err) throw err
        res.json(users)
    })
})
//Update User
router.put('/update',constants.upload.single('avatar') ,async (req,res)=>{
    const saltRound = 10
    let passwordHash = await bcrypt.hash(req.body.password, saltRound)
    req.body.password = passwordHash
    if(!req.body._id){
        res.status(400).send({messError: 'not found ID'})
    }

    const id = {_id: req.body._id}
    const update = {
        _id: req.body._id,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        address: req.body.address,
        age: req.body.age,
        avatar: req.file.path
    }
    User.findByIdAndUpdate(id, update, {new: true}, function (err, result){
        if(err) return res.send(err)
        res.json(result)
    })
})
//Delete User
router.delete('/:id', (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ messError: 'not found id' })
    }
    const id = { _id: req.params.id }
    User.findByIdAndDelete(id, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ mess: "Sucessesful delete id:" + req.params.id })
        }
    })
})

module.exports = router
