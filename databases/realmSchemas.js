const Realm = require('realm')
const CLIENT_SCHEMA = "Client"
const Promise = require('promise')
const { resolve, reject } = require('promise')

const ClientSchema = {
    name: CLIENT_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int', //primary key
        name: {type: 'string', indexed: true},
        email: 'string',
    }
}

const databaseOptions = {
    path: 'RealmInNodeJS.realm',
    schema: [ClientSchema],
    schemaVersion: 0, //optional
}

//functions for UserSchema
const insertNewClient = newClient => new Promise((resolve, reject)=>{
    Realm.open(databaseOptions).then(realm=>{
        //Check if existing user
        let filteredClients = realm.objects(CLIENT_SCHEMA).filtered(`name='${newClient.name.trim()}' AND email='${newClient.email.trim()}'`)
        if(filteredClients.length > 0){
            reject("Client with the same name and email exists!!")
            return
        }
        realm.write(()=>{
            newClient.id = Math.floor(Date.now())
            realm.create(CLIENT_SCHEMA, newClient)
            resolve(newClient)
        })
    }).catch((error)=> reject(error))
})

const findAllClients = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let allClients = realm.objects(CLIENT_SCHEMA)
        resolve(allClients)
    }).catch((error)=>{
        reject(error)
    })
})

//Filtrar por nombre
const filterClientByName = (searchedName) => new Promise((resolve, reject)=>{
    Realm.open(databaseOptions).then(realm => {
        let filteredClients = realm.objects(CLIENT_SCHEMA).filtered(`name CONTAINS[c] '${searchedName}'`)
        resolve(filteredClients)
    }).catch((error)=>{
        reject(error)
    })
})

//Update an existing user
const updateAnClient = (clientId, updatingClient) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            let client = realm.objectForPrimaryKey(CLIENT_SCHEMA, clientId)
            if(!client){
                reject(`Cannot find client with ID=${clientId} to update`)
                return 
            }
            client.name = updatingClient.name
            client.email = updatingClient.email
            resolve()
        });
    }).catch((error) => reject(error))
})

//Delete user
const deleteClient = (clientId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let clientObject = realm.objectForPrimaryKey(CLIENT_SCHEMA, clientId);
        if(!clientObject){
            reject(`Cannot find client with ID=${clientId} to delete`)
            return 
        }
        realm.write(() => {
            realm.delete(clientObject);
            resolve();
        })
    }).catch((error) => reject(error));
})

//For testing purpose
findAllClients().then((allClients)=>{
    console.log(`allClients = ${JSON.stringify(allClients)}`)
}).catch((error)=>{
    console.log(`Cannot get all clients. Error: ${error}`)
})

module.exports = {
    insertNewClient,
    filterClientByName,
    updateAnClient,
    deleteClient
}