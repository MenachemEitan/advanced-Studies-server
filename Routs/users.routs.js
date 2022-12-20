const express = require('express');
const DB = require('../lib/dbControler');
const { jwtSing } = require('../lib/JWT');
const { ErrItemAlreadyExists,ErrWrongPass, ErrItemDoesntExist, ErrNotAuth  } = require('../lib/ResponseHandler');
const route = express.Router();
const app = express();
const users = new DB('users');
const classes = new DB('class')
const {signUpSchema, logInSchema} = require('../dto/usersSchema');
const validator = require('../dto/validator');
const { object } = require('yup');
const { ObjectID } = require('bson');


route.post('/login', validator(logInSchema),async (req, res, next)=>{
    const user = req.body;
    const existsUser = await users.getByEmail(user.email);
    if(!existsUser){
        return res.not(ErrItemDoesntExist("user"))
    }else{
        if(existsUser.password==user.password){
            delete existsUser.password;
            return res.ok([jwtSing({id:existsUser._id,permissions:existsUser.permissions }), existsUser])
        }else{
            return res.not(ErrWrongPass())
        }
    }

})
route.get('/getme', async(req, res, next)=>{
    if(!req.user){
        return res.not(ErrNotAuth())
    }
    else{
       temp = await users.getById(req.user.id);
       delete temp.password
        return res.ok(temp)
    }
})
route.post('/signup',validator(signUpSchema) ,async(req, res, next)=>{
    const user = req.body;
    const existsUser =await users.getByEmail(user.email);
    if(!existsUser){
        user.myClass={};
        user.permissions = 'user'
        temp =await users.addItem(user)
        delete temp.password;
        return res.ok([jwtSing({id:temp._id,permissions:temp.permissions} ), temp])
    }else{
        return res.not(ErrItemAlreadyExists("user"))
    }
    
 })

 route.get('/myClasses',async (req, res, next)=>{
    if (!req.user){
        return res.not(ErrNotAuth());
    }else{
        const user =await users.getById(req.user.id);
        return res.ok(user.myClass)
    }
 })

 route.get('/recommended',async(req, res, next)=>{
    if(!req.user){
        return res.not(ErrNotAuth())
    }else{
        const user =await users.getById(req.user.id);
        const tempRecommendations = [];
        const tempClasses = await classes.get()
        tempClasses.forEach(element => {
            for(let val in element.connectivity){
                if (!user.myClass[val] && user.myClass[ObjectID(element._id).toString()]){
                    tempRecommendations.push([val, element.connectivity[val]])
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
          let temp = [];
          items.slice(0, 5)
          for (let i = 0; i<items.length; i++){
            temp.push(await classes.getById(items[i][0]))
          }
          
        res.ok(temp)
    }
    
 })





module.exports = route