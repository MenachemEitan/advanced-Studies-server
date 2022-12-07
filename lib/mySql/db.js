const {createPool} = require('mysql');
const {sqlUserName, sqlPass} = require('../../.env')

const pool = createPool({
   host : "localhost", 
   user: sqlUserName,
   password: sqlPass,
   connectionLimit:10
})


pool.query(`show databases`, (err, res)=>{
    if(err){
        console.log(err);
    }
    return console.log(res);
})