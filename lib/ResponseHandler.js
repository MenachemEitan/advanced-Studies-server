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

module.exports = {okResponse, CreatedRes, ErrNotAuth}