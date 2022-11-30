const { json } = require('express');
const fs = require('fs');

class DB{
    constructor(name){
        this.name = name;
        this.path = `DB/${name}.json`;
    }
    create = (json) =>{
        fs.writeFileSync(this.path, JSON.stringify(json))
    }
    get = () =>{
        const content = fs.readFileSync(this.path, 'utf8');
        return JSON.parse(content);
    }
    getById = (id)=>{
        const content = this.get();
        return content.find(element => element.id===parseInt(id));
    }
    getByEmail = (email) =>{
        const content = this.get();
        return content.find(element => element.email===email);
    }
    getByFieldName = (fieldName) =>{
        const content = this.get();
        return content.find(element => element.fieldName===fieldName);
    }
    getByClassName = (className) =>{
        const content = this.get();
        return content.find(element => element.className===className);
    }
    addItem =(json) =>{
        const content = this.get()
        const item = {
            ...json,
            id: parseInt(Date.now())
        }
        content.push(item)
        this.create(content)
        return item
    }
    deleteById = (id) => {
        const content = this.get().filter(i => i.id !== parseInt(id))
        this.create(content)
        return ("item deleted")
    }
    updateItem = (id, json) => {
        const content = this.get()
        const parsId = parseInt(id)
        const updatedList = content.map(i => {
            if (i.id === parsId) {
                return {...json,id:parsId}
            } else return i
            })
        this.create(updatedList)
        return("item is updated")
    }
}

module.exports = DB
