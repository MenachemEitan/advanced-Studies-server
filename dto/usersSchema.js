const yup = require('yup');
const { string } = require('yup/lib/locale');

const signUpSchema = yup.object().shape({
    firstName:yup.string().required(),
    lastName:yup.string().required(),
    email:yup.string().email().required(),
    password:yup.string().required().min(8),
    nickName:yup.string()
})

const logInSchema = yup.object().shape({
    email:yup.string().email().required(),
    password: yup.string().required().min(8)
 })

 module.exports = {signUpSchema, logInSchema}