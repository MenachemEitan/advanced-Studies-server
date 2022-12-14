const express = require('express');
const route = express.Router();
const app = express()
const DB = require('../lib/dbControler');
const multer = require('multer')
const question = new DB('question');
const classes = new DB('class');
const field = new DB('field');
const users = new DB('users');
const class_rathing = new DB('class_reathing')
const { ErrItemAlreadyExists, ErrItemDoesntExist } = require('../lib/ResponseHandler')
const { uploadFile, getFileStream } = require('../lib/s3')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { ObjectId } = require('mongodb')
// const upload = require('../DB/s3')


route.post('/addfield', async (req, res, next) => {
    const { fieldName } = req.body;
    const existsField = await field.getByFieldName(fieldName);
    if (!existsField) {
        let temp = req.body;
        temp.class = {}
        return res.ok(await field.addItem(req.body))
    } else
        return res.not(ErrItemAlreadyExists("field"))

})

route.post('/addclass/:fieldName', async (req, res, next) => {
    const { className } = req.body;
    const existsClass = await classes.getByClassName(className);
    if (!existsClass) {
        tempClass = await classes.addItem(req.body)
        tempField = await field.getByFieldName(req.params.fieldName)
        if (!tempField.class) {
            tempField.class = [ObjectId(tempClass._id)]
        } else {
            tempField.class = [...tempField.class, ObjectId(tempClass._id)]

        }
        await field.updateItem(tempField._id, tempField)

        return res.ok(tempClass)
    } else
        return res.not(ErrItemAlreadyExists("class"))
})


route.post('/addquestion/:className', async (req, res, next) => {
    const { className } = req.params;
    const tempClass = await classes.getByClassName(className);
    const tempQuestion = await question.addItem(req.body);
    if (!tempClass) {
        return res.not(ErrItemDoesntExist("class"))
    }
    if (!tempClass.question) {
        tempClass.question = [ObjectId(tempQuestion._id)]
    } else {
        tempClass.question = [...tempClass.question, ObjectId(tempQuestion._id)]
    }
    const tempClassId = tempClass._id
    delete tempClass._id
    await classes.updateItem(tempClassId, tempClass)
    return res.ok(tempQuestion)
})

route.get('/:id', async (req, res, next) => {
    const classId = req.params.id;
    tempClass = await classes.getById(classId)
    if (tempClass) {
        return res.ok(tempClass)
    } else
        return res.not(ErrItemDoesntExist('class'))
})

route.get('/question/:id', async (req, res, next) => {
    const questionId = req.params.id;
    tempQuestion = await question.getById(questionId)
    if (tempQuestion) {
        return res.ok(tempQuestion)
    } else
        return res.not(ErrItemDoesntExist('Question'))
})

route.get('/popularClass/get', async (req, res, next) => {
    const temp = await class_rathing.get()
    var items = Object.keys(temp[0]).map(function (key) {
        return [key, temp[0][key]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    console.log("items ", items);
    let returnVal = [];
    const tempList = items.slice(1, 5)
    console.log("tempList ", tempList);
    for (let i = 0; i < tempList.length; i++) {
        let id = tempList[i][0]
        returnVal.push(await classes.getById(id))
    }
    return res.ok(returnVal)
})
route.post('/login/startClass', async (req, res, next) => {
    const { classId } = req.body;
    const user = await users.getById(req.user.id)
    if (!user.myClass[classId]) {
        let classRathing = await class_rathing.get();
        classRathing[0][classId]++;
        user.myClass[classId] = []
        let temp = user._id
        delete user._id
        await users.updateItem(temp, user);
        let tempClassId = classRathing[0]._id
        delete classRathing[0]._id
        await class_rathing.updateItem(tempClassId, classRathing[0]);
        return res.ok(await classes.getById(classId))
    } else {
        const theClass = await classes.getById(classId);
        return res.ok([theClass, user.myClass[classId]])
    }
})


route.post('/login/submitAnswer/:id', async (req, res, next) => {
    const questionId = req.params.id;
    const { classId } = req.body;
    const user = await users.getById(req.user.id);
    console.log(user.myClass[classId]);
    if (!user.myClass[classId]){
        user.myClass[classId] = [questionId]
        const temp = user._id
        delete user._id
        await users.updateItem(temp, user)
        return res.ok("Your Answer has been successfully received")
    }
    if (!user.myClass[classId].includes(questionId)) {
        user.myClass[classId] = [...user.myClass[classId], questionId];
        const temp = user._id
        delete user._id
        await users.updateItem(temp, user)
        return res.ok("Your Answer has been successfully received")
    }
    else return res.ok("You have already answered this question")

})


route.post('/notLogin/startClass', async (req, res, next) => {
    const { classId } = req.body;
    let classRathing = await class_rathing.get();
    console.log("classRathing.id  ", classRathing.id);
    console.log("classRathing[0][classId] BEFOR ", classRathing[0]);
    classRathing[0][classId]++;
    console.log("classRathing[0][classId] AFTER ", classRathing[0]);
    let temp = classRathing[0]._id
    delete classRathing[0]._id
    await class_rathing.updateItem(temp, classRathing[0]);
    return res.ok(await classes.getById(classId));
})

const uploads = multer({ dest: 'oploads/' });
route.post('/uploadPic/:id', uploads.single("image"), async (req, res, next) => {
    const {destination, name} = req.query
    console.log(destination, name);
    const file = req.file;
    const result = await uploadFile(file);
    await unlinkFile(file.path)
    console.log(result);
    if(destination=="question"){
        const temQuestion = question.getById(req.params.id);
        temQuestion.img = result.key;
        delete temQuestion._id
        console.log("temQuestion  ", temQuestion);
        await question.updateItem(req.params.id, temQuestion)
        res.ok(result)
    }else if(destination=="class"){
        const tempClass = classes.getById(req.params.id);
        tempClass[name] = result.key; 
        delete tempClass._id
        await classes.updateItem(req.params.id, tempClass)
        res.ok(result)
    }

})

route.get('/getpic/pic/:id', (req, res) => {
    const readStream = getFileStream(req.params.id);
    readStream.pipe(res);
})

route.get('/search/get', async (req, res, next) => {
    const textToSearchBy = req.query.text;
    const AllField = await field.get()
    const returnList = []
    AllField.forEach(async element => {
        if (element.fieldName.includes(textToSearchBy)) {
            for (let i = 0; i<element.class.length; i++){
                console.log("element.class.length[i] ",element.class[i]);
                returnList.push(await classes.getById(element.class[i]))
            }
        }
    });
    if (returnList.length == 0) {
        const allClass = await classes.get();
        allClass.forEach(element => {
            if (element.className.includes(textToSearchBy)) {
                returnList.push(element)
            }
        })
    }
    if (returnList.length == 0) {
        return res.not(ErrItemDoesntExist("A field or class that matches the search term"))
        
    } else
        console.log(3);
        return res.ok(returnList)
})














module.exports = route