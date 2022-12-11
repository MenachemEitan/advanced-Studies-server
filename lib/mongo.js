const { MongoClient } = require('mongodb');
const {mongo_uri} = require('../.env')

let advanced_studies = {}


MongoClient.connect(mongo_uri, { useUnifiedTopology: true }).then((client, err) => {
    if(err){
        console.log("unable to connect to db ");
        return
    }
    else{ console.log("monog connect");
    advanced_studies = client.db('advanced-studies')} 
   


});




module.exports = {
    mongo_collection :(name)=>{
        return advanced_studies.collection(name)
    }

}
