const express = require('express');
const route = express.Router();
const app = express()
const DB = require('../lib/dbControler');
const question = new DB('question');
const classes = new DB('class');
const field = new DB('field')
const {ErrItemAlreadyExists} = require('../lib/ResponseHandler')


route.post('/addfield',(req, res, next) =>{
    const {fieldName} = req.body;
    const existsField = field.getByFieldName(fieldName);
    if (!existsField){
        res.ok(field.addItem(req.body))
    }else(
        res.not(ErrItemAlreadyExists("field"))
    )
})

route.post('/addclass/:fieldName',(req, res, next) =>{
    const {className} = req.body;
    const existsClass = classes.getByClassName(className);
    if (!existsClass){
        tempClass = classes.addItem(req.body)
        tempField = field.getByFieldName(req.params.fieldName)
        if(!tempField.class){
            tempField.class = [tempClass.id]
        } else{
            tempField.class = [...tempField.class, tempClass.id]
        }
        field.updateItem(tempField.id,tempField )
        
        res.ok(tempClass)
    }else(
        res.not(ErrItemAlreadyExists("class"))
    )
})

route.post('/addquestion/:className',(req, res, next) =>{
    const {className} = req.params;
    const tempClass = classes.getByClassName(className);
    const tempQuestion = question.addItem(req.body);
    if(!tempClass.question){
        tempClass.question = [tempQuestion.id]
    }else{
        tempClass.question = [...tempClass.question,tempQuestion.id]
    }
    classes.updateItem(tempClass.id, tempClass)
    res.ok(tempQuestion)
})







module.exports = route