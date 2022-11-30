class ResponseHandler{
    status = 200;
    success = true;
    data = '';

    constructor(status, success, data){
        this.status = status;
        this.success = success;
        this.data = data;
    }
    send = () =>{
        return {
            status: this.status,
            payload:{
                success:this.success,
                [this.success?'data':'message']:this.data
            }
        }
    }
}


const okResponse =(data)=> new ResponseHandler(200, true, data).send()
const CreatedRes = (data) => new ResponseHandler(201, true, data).send()
const ErrNotAuth =()=> new ResponseHandler(401, false, "you are not authorise").send()
const ErrUserAlreadyExists = () =>new ResponseHandler(409, false, "The user already exists ").send()
const ErrUserDoesntExist =()=> new ResponseHandler(404, false, "user doesn't exist").send()
const ErrWrongPass =()=> new ResponseHandler(401, false, "wrong password").send()
const ErrSchema = (errors) => new ResponseHandler(409, false, errors).send()

module.exports = {okResponse, CreatedRes, ErrNotAuth, ErrUserAlreadyExists, ErrUserDoesntExist, ErrWrongPass,ErrSchema}