const { createPool } = require('mysql');
const { sqlUserName, sqlPass } = require('../../.env')

const pool = createPool({
   host : "localhost", 
   user: sqlUserName,
   password: sqlPass,
   connectionLimit:10
})


const sqlQuery = (query) => pool.query(query, (err, res)=>{
    if(err){
        console.log(err);
    }
    return console.log(res);
})
// const text =sqlQuery(`show databases`)
// show databases
