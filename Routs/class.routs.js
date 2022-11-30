const express = require('express');
const route = express.Router();
const app = express()
const DB = require('../lib/dbControler');
const question = new DB('question');
const classes = new DB('class');
const field = new DB('field')
const users = new DB('users')
const class_rathing = new DB('class_reathing')
const { ErrItemAlreadyExists, ErrItemDoesntExist } = require('../lib/ResponseHandler')


route.post('/addfield', (req, res, next) => {
    const { fieldName } = req.body;
    const existsField = field.getByFieldName(fieldName);
    if (!existsField) {
        return res.ok(field.addItem(req.body))
    } else
        return res.not(ErrItemAlreadyExists("field"))

})

route.post('/addclass/:fieldName', (req, res, next) => {
    const { className } = req.body;
    const existsClass = classes.getByClassName(className);
    if (!existsClass) {
        tempClass = classes.addItem(req.body)
        tempField = field.getByFieldName(req.params.fieldName)
        if (!tempField.class) {
            tempField.class = [tempClass.id]
        } else {
            tempField.class = [...tempField.class, tempClass.id]
        }
        field.updateItem(tempField.id, tempField)

        return res.ok(tempClass)
    } else
        return res.not(ErrItemAlreadyExists("class"))
})

route.post('/addquestion/:className', (req, res, next) => {
    const { className } = req.params;
    const tempClass = classes.getByClassName(className);
    const tempQuestion = question.addItem(req.body);
    if (!tempClass.question) {
        tempClass.question = [tempQuestion.id]
    } else {
        tempClass.question = [...tempClass.question, tempQuestion.id]
    }
    classes.updateItem(tempClass.id, tempClass)
    return res.ok(tempQuestion)
})


route.get('/:id', (req, res, next) => {
    const classId = req.params.id;
    tempClass = classes.getById(classId)
    if (tempClass) {
        return res.ok(tempClass)
    } else
        return res.not(ErrItemDoesntExist('class'))
})

route.get('/question/:id', (req, res, next) => {
    const questionId = req.params.id;
    tempQuestion = question.getById(questionId)
    if (tempQuestion) {
        return res.ok(tempQuestion)
    } else
        return res.not(ErrItemDoesntExist('Question'))
})

route.get('/popularClass/get', (req, res, next) => {
    const temp = class_rathing.get()

    var items = Object.keys(temp).map(function (key) {
        return [key, temp[key]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    let returnVal =[]
    const tempList = items.slice(0, 5)

    tempList.forEach(element =>returnVal.push(classes.getById(parseInt(element[0]))) )
    return res.ok(returnVal)
})

route.post('/login/startCoutse', (req, res, next)=>{
    const {classId} = req.body;
    const user = users.getById(req.user)
    if(!user.myClass[classId]){
        let classRathing = class_rathing.get();
        console.log("classId ", classId);
        classRathing[classId] ++;
        user.myClass[classId]=[]
        users.updateItem(user.id, user);
        class_rathing.create(classRathing);
        return res.ok(classes.getById(classId))
    } else{
        const theClass = classes.getById(classId);
        return res.ok([theClass,user.myClass[classId] ])
    }
})












module.exports = route