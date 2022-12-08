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
const ErrNotAuth =()=> new ResponseHandler(401, false, ["you are not authorise"]).send()
const ErrItemAlreadyExists = (item) =>new ResponseHandler(409, false,[ `The ${item}  already exists`]).send()
const ErrItemDoesntExist =(item)=> new ResponseHandler(404, false, [`${item} doesn't exist`]).send()
const ErrWrongPass =()=> new ResponseHandler(401, false, ["wrong password"]).send()
const ErrSchema = (errors) => new ResponseHandler(409, false, errors).send()

module.exports = {okResponse, CreatedRes, ErrNotAuth, ErrItemAlreadyExists, ErrItemDoesntExist, ErrWrongPass,ErrSchema}