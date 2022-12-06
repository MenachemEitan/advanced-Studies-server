const express = require('express');
const route = express.Router();
const app = express()
const DB = require('../lib/dbControler');
const multer = require('multer')
const question = new DB('question');
const classes = new DB('class');
const field = new DB('field')
const users = new DB('users')
const class_rathing = new DB('class_reathing')
const { ErrItemAlreadyExists, ErrItemDoesntExist } = require('../lib/ResponseHandler')
const {uploadFile, getFileStream} = require('../DB/s3')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
// const upload = require('../DB/s3')


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
    // 
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
    let returnVal = []
    const tempList = items.slice(0, 5)

    tempList.forEach(element => returnVal.push(classes.getById(parseInt(element[0]))))
    return res.ok(returnVal)
})

route.post('/login/startClass', (req, res, next) => {
    const { classId } = req.body;
    const user = users.getById(req.user)
    if (!user.myClass[classId]) {
        let classRathing = class_rathing.get();
        console.log("classId ", classId);
        classRathing[classId]++;
        user.myClass[classId] = []
        users.updateItem(user.id, user);
        class_rathing.create(classRathing);
        return res.ok(classes.getById(classId))
    } else {
        const theClass = classes.getById(classId);
        return res.ok([theClass, user.myClass[classId]])
    }
})

route.post('/login/submitAnswer/:id', (req, res, next) => {
    const questionId = req.params.id;
    const { classId } = req.body;
    const user = users.getById(req.user);
    if (!user.myClass[classId].includes(parseInt(questionId))) {
        user.myClass[classId] = [...user.myClass[classId], parseInt(questionId)];
        users.updateItem(user.id, user)
        return res.ok("Your Answer has been successfully received")
    }
    else return res.ok("You have already answered this question")

})


route.post('/notLogin/startClass', (req, res, next) => {
    const { classId } = req.body;
    let classRathing = class_rathing.get();
    classRathing[classId]++;
    class_rathing.create(classRathing);
    return res.ok(classes.getById(classId));
})







const uploads = multer({ dest:'oploads/'});
route.post('/uploadPic/:id', uploads.single("image"), async(req, res, next) => {
    const temQuestion = question.getById(req.params.id);
    const file = req.file;
    const result = await uploadFile(file);
    await unlinkFile(file.path)
    console.log(result);
    temQuestion.img = result.key;
    question.updateItem(req.params.id,temQuestion )
    res.ok(result)
})
route.get('/getpic/pic/id', (req, res)=>{
    const readStream = getFileStream('ed4b340867eba6643359ae3008902abb')
    readStream.pipe(res)
})













route.get('/search/get', (req, res, next) => {
    const textToSearchBy = req.query.text;
    const AllField = field.get()
    const returnList = []
    AllField.forEach(element => {
        if (element.fieldName.includes(textToSearchBy)) {
            element.class.forEach(classId => {
                returnList.push(classes.getById(classId))
            }
            )
        }
    });
    if (returnList.length == 0) {
        const allClass = classes.get();
        allClass.forEach(element => {
            if (element.className.includes(textToSearchBy)) {
                returnList.push(element)
            }
        })
    }
    if (returnList.length == 0) {
        return res.not(ErrItemDoesntExist("A field or class that matches the search term"))
    } else
        return res.ok(returnList)
})














module.exports = route