const express = require('express');
const DB = require('../lib/dbControler');
const { jwtSing } = require('../lib/JWT');
const { ErrItemAlreadyExists,ErrWrongPass,ErrItemDoesntExist, ErrNotAuth  } = require('../lib/ResponseHandler');
const route = express.Router();
const app = express();
const users = new DB('users');
const {signUpSchema, logInSchema} = require('../dto/usersSchema');
const validator = require('../dto/validator');


route.post('/login', validator(logInSchema), (req, res, next)=>{
    const user = req.body;
    const existsUser = users.getByEmail(user.email);
    if(!existsUser){
        return res.not(ErrItemDoesntExist("user"))
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
        user.myClass={}
        temp = users.addItem(user)
        delete temp.password;
        return res.ok([jwtSing(temp.id), temp])
    }else{
        return res.not(ErrItemAlreadyExists("user"))
    }
    
 })

 route.get('/myClasses', (req, res, next)=>{
    if (!req.user){
        return res.not(ErrNotAuth());
    }else{
        const user = users.getById(req.user);
        return res.ok(user.myClass)
    }
 })



module.exports = route