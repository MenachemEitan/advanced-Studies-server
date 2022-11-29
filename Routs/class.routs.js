const express = require('express');
const route = express.Router();
const app = express()

route.get('/:id', (req, res, next)=>{
    return res.ok(req.user)
})

module.exports = route