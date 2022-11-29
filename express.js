const express = require('express');
const app = express();
const {okResponse, CreatedRes, ErrNotAuth} = require('./lib/ResponseHandler')
const cors = require('cors');
const {jwtVerify} = require('./lib/JWT')

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

app.use(cors({
    origin:'http://localhost:3000'
}))

app.use((req, res, next)=>{
    const accessToken = req.headers.authorization;
    try{
        const user = jwtVerify(accessToken)
        req.user = user;
        next();
    }catch(err){
        next()
    }
})



app.use('/users', require('./Routs/users.routs'))
app.use('/class', require('./Routs/class.routs'))









app.listen(4000, ()=>{
    console.log("Express is listening on port 4000")
})