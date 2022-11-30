const {ErrSchema} = require('../lib/ResponseHandler')

const validator = (schema) =>{

    return (req, res, next) =>{
        schema.validate(req.body, {abortEarly:false})
        .then((valid) => {
            next()
        }).catch((err) => {
            res.not(ErrSchema(err.errors))
        });
    }
}

module.exports = validator