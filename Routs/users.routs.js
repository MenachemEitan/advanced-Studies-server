const express = require('express');
const DB = require('../lib/dbControler');
const { jwtSing } = require('../lib/JWT');
const { ErrUserAlreadyExists,ErrWrongPass,ErrUserDoesntExist  } = require('../lib/ResponseHandler');
const route = express.Router();
const app = express();
const users = new DB('users')


route.post('/login', (req, res, next)=>{
    const user = req.body;
    const existsUser = users.getByEmail(user.email);
    if(!existsUser){
        return res.not(ErrUserDoesntExist())
    }else{
        if(existsUser.password===user.password){
            return res.ok(jwtSing(existsUser.id))
        }else{
            return res.not(ErrWrongPass())
        }
    }

})
route.post('/signup', (req, res, next)=>{
    const user = req.body;
    const existsUser = users.getByEmail(user.email);
    if(!existsUser){
        temp = users.addItem(user)
        return res.ok(jwtSing(temp.id))
    }else{
        return res.not(ErrUserAlreadyExists())
    }
    
 })



module.exports = route