const express = require('express');
const DB = require('../lib/dbControler');
const { jwtSing } = require('../lib/JWT');
const { ErrItemAlreadyExists,ErrWrongPass,ErrItemDoesntExist, ErrNotAuth  } = require('../lib/ResponseHandler');
const route = express.Router();
const app = express();
const users = new DB('users');
const classes = new DB('class')
const {signUpSchema, logInSchema} = require('../dto/usersSchema');
const validator = require('../dto/validator');
const { object } = require('yup');


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

 route.get('/recommended',(req, res, next)=>{
    if(!req.user){
        return res.not(ErrNotAuth())
    }else{
        const user = users.getById(req.user);
        const tempRecommendations = [];
        classes.get().forEach(element => {
            for(let val in element.connectivity){
                if (user.myClass[val] && !user.myClass[element.id]){
                    tempRecommendations.push([element.id,element.connectivity[val]])
                }
            }
        });
        tempCompress = {}
        for(let i = 0; i<tempRecommendations.length;i++ ){
            if(!(tempRecommendations[i][0] in tempCompress) ){
                tempCompress[tempRecommendations[i][0]] = tempRecommendations[i][1]
            }else{
                tempCompress[tempRecommendations[i][0]] += tempRecommendations[i][1]
            }
        }
        const items = Object.keys(tempCompress).map(function(key) {
            return [key, tempCompress[key]];
          });
          items.sort(function(first, second) {
            return second[1] - first[1];
          });
        res.ok(items.slice(0, 5))
    }
    
 })





module.exports = route