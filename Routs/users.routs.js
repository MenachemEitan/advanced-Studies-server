const express = require('express');
const DB = require('../lib/dbControler');
const { jwtSing } = require('../lib/JWT');
const { ErrItemAlreadyExists,ErrWrongPass,ErrUserDoesntExist  } = require('../lib/ResponseHandler');
const route = express.Router();
const app = express();
const users = new DB('users');
const {signUpSchema, logInSchema} = require('../dto/usersSchema');
const validator = require('../dto/validator');


route.post('/login', validator(logInSchema), (req, res, next)=>{
    const user = req.body;
    const existsUser = users.getByEmail(user.email);
    if(!existsUser){
        return res.not(ErrUserDoesntExist())
    }else{
        if(existsUser.password===user.password){
            delete existsUser.password;
            return res.ok([jwtSing(existsUser.id), existsUser])
        }else{
            return res.not(ErrWrongPass())
        }
    }

})
route.post('/signup',validator(signUpSchema) ,(req, res, next)=>{
    const user = req.body;
    const existsUser = users.getByEmail(user.email);
    if(!existsUser){
        temp = users.addItem(user)
        delete temp.password;
        return res.ok([jwtSing(temp.id), temp])
    }else{
        return res.not(ErrItemAlreadyExists("user"))
    }
    
 })



module.exports = route