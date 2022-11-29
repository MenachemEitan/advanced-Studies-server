var jwt = require('jsonwebtoken');

const {privateKey} = require('../.env');

const jwtSing = (payload) =>{
    const accessToken = jwt.sign(payload, privateKey);
    return accessToken;
}

const jwtVerify = (token)=>{
    const payload = jwt.verify(token, privateKey)
    return payload
}

module.exports = {jwtSing, jwtVerify}