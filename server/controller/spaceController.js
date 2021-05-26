const express = require('express');
const router = express.Router();
const Space = require('../model/Space');

router.get('/:id',async (req, res) => {
    if(!req.params.id){
        res.status(400).send({messError: "not found id"})
    }
    const id = {_id: req.params.id}
    const spaces = await (await Space.findById(id)).populated({path: 'author'})
    res.json(spaces)
})

module.exports = router;