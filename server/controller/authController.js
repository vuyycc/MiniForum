const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const bcrypt = require('bcrypt')

router.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({
        email: email
    })
    let checkPass = false
    if(user){
        checkPass = bcrypt.compareSync(password, user.password)
    }
    if(user, checkPass){
        const accessToken = jwt.sign({email: user.email, _id: user._id}, process.env.SECRET_KEY);
        return res.json({
            accessToken
        })
    }else {
        return res.status(400).send({err:'Email or password incorrect'})
    }
})

router.post('/signup', async (req, res) => {
    let body = req.body
    const userExist = await User.findOne({
        email: req.body.email
    });
    if (userExist) {
        return res.status(400).send({ err: 'Email already exist' })
    }

    const saltRounds = 10;
    let passwordHash = await bcrypt.hash(req.body.password, saltRounds)

    let bodyNew = {
        email: body.email,
        name: body.name,
        password: passwordHash,
        address: "111",
        age: "222",
        avatar: "333"
    }
    let user = new User(bodyNew)

    user.save((err) => {
        if (err) throw err;
        console.log('User save successfully');
    })
    res.json({ "data": user })
})


module.exports = router