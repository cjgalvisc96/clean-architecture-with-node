const {
    inMemory: inMemoryDb
}= require("../../database");

const {v4: uuidv4} = require("uuid");

module.exports = {
    add: async user => {
        inMemoryDb.users.push(user);
    },
    update: async user => {
        const index = inMemoryDb.users.findIndex(
            item => item.id === user.id
        );
        if(index >= 0){
            inMemoryDb.users[index] = user;
            return inMemoryDb.users[index];
        }
        return null;
    },
    delete: async user => {
        const index = inMemoryDb.users.findIndex(
            item => item.id === user.id
        );
        if(index >= 0){
            inMemoryDb.users.slice(index, 0);
            return user;
        }
        return null;
    },
    getById: async id => {
        return inMemoryDb.users.find(item => item.id === id);
    }
}