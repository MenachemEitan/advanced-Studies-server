const express = require('express');
const route = express.Router();
const app = express();

route.post('/login', (req, res, next)=>{
   return res.ok("login")
})



module.exports = route