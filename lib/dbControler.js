const { json } = require('express');
const fs = require('fs');
const { ASCII } = require('mysql/lib/protocol/constants/charsets');
const { mongo_collection } = require('./mongo')
const { ObjectId } = require('mongodb')


// class DB{
//     constructor(name){
//         this.name = name;
//         this.path = `DB/${name}.json`;
//     }
//     create = (json) =>{
//         fs.writeFileSync(this.path, JSON.stringify(json))
//     }
//     get = () =>{
//         const content = fs.readFileSync(this.path, 'utf8');
//         return JSON.parse(content);
//     }
//     getById = (id)=>{
//         const content = this.get();
//         return content.find(element => element.id===parseInt(id));
//     }
//     getByEmail = (email) =>{
//         const content = this.get();
//         return content.find(element => element.email===email);
//     }
//     getByFieldName = (fieldName) =>{
//         const content = this.get();
//         return content.find(element => element.fieldName===fieldName);
//     }
//     getByClassName = (className) =>{
//         const content = this.get();
//         return content.find(element => element.className===className);
//     }
//     addItem =(json) =>{
//         const content = this.get()
//         const item = {
//             ...json,
//             id: parseInt(Date.now())
//         }
//         content.push(item)
//         this.create(content)
//         return item
//     }
//     deleteById = (id) => {
//         const content = this.get().filter(i => i.id !== parseInt(id))
//         this.create(content)
//         return ("item deleted")
//     }
//     updateItem = (id, json) => {
//         const content = this.get()
//         const parsId = parseInt(id)
//         const updatedList = content.map(i => {
//             if (i.id === parsId) {
//                 return {...json,id:parsId}
//             } else return i
//             })
//         this.create(updatedList)
//         return("item is updated")
//     }
// }

////////////////////////////////////////////////////////////////////////////////////////

class DB {
    constructor(name) {
        this.name = name;
    }

    get = async () => {
        const content = await mongo_collection(this.name).find({}).toArray();
        return content;
    }
    getById = async (id) => {
        try {
            const content = await mongo_collection(this.name).findOne({ _id: ObjectId(id) });
            return content;
        } catch (err) {
            console.log("err in get by id ", err);
            return false
        }

    }

    getByEmail = async (email) => {
        try {
            const content = await mongo_collection(this.name).findOne({ email: email });
            return content
        } catch (err) {
            return false
        }
    }
    getByFieldName = async (name) => {
        try {
            const content = await mongo_collection(this.name).findOne({ fieldName: name });
            return content
        } catch (err) {
            return false
        }
    }
    getByClassName = async (className) => {
        try {
            const content = await mongo_collection(this.name).findOne({ className: className });
            return content
        } catch (err) {
            return false
        }
    }
    addItem = async (json) => {
        const content = await mongo_collection(this.name).insertOne(json);
        const returnVal = await mongo_collection(this.name).findOne({ _id: ObjectId(content.insertedId) });
        return returnVal
    }
    deleteById = async (id) => {
        const content = await mongo_collection(this.name).deleteOne({ id: id });
        return ("item deleted")
    }
    updateItem = async (id, json) => {
        const content = await mongo_collection(this.name).updateOne({_id:ObjectId(id) }, {
            $set: json
        });
        return ("item is updated")
    }
}


module.exports = DB
