const express = require('express');
const app = express();
const {okResponse, CreatedRes} = require('./lib/ResponseHandler')

app.use(express.json())

app.use((rew, res, next) =>{
    res.ok = (data) =>{
        const resp =  okResponse(data)
        res.status(resp.status).send(resp.payload)
    } 
    res.create = (data) =>{
        const resp = CreatedRes(data)
        res.status(resp.status).send(resp.payload)
    }
    res.not = (resp) =>{
        res.status(resp.status).send(resp.payload)
    }
    next()
})








app.listen(4000, ()=>{
    console.log("Express is listening on port 4000")
})