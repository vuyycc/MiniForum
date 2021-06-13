const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const bcrypt = require('bcrypt')

// Login
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
        const accessToken = jwt.sign({email: user.email, _id: user._id, role: user.role}, process.env.SECRET_KEY);
        return res.json({
            accessToken
        })
    }else {
        return res.status(400).send({err:'Email or password incorrect'})
    }
})

module.exports = router
