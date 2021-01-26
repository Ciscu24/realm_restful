const bodyParser = require('body-parser')
const { response } = require('express')
const express = require('express')
const { request } = require('http')
const app = express()
app.use(bodyParser.urlencoded({extended:false}))

//parse application/json
app.use(bodyParser.json())

//Databases
const{
    insertNewClient,
    filterClientByName,
    updateAnClient,
    deleteClient
} = require('../databases/realmSchemas')

app.get('/', (request, response)=>{
    response.setHeader('Content-Type', 'application/json');
    response.send({
        status: "success",
        name: "Nguyen Duc Hoang",
        sms: "This is root path for Realm Nodejs project"
    })
})

//Filter users by name
app.get('/filter_clients_by_name', (request, response) => {
    const { searchedName } = request.query
    filterClientByName(searchedName).then(filteredClients => {
        response.send({
            status: "success",
            message: `Filtered clients with name: "${searchedName}" successfully`,
            data: filteredClients,
            numberOfObjects: filteredClients.length
        })
    }).catch((error)=>{
        response.send({
            status: "failed",
            message: `Filtered clients with name: ${searchedName} error: ${error}`
        })
    })
})

//POST request to insert new user
app.post('/insert_new_client', (request, response)=>{
    const {tokenkey} = request.headers
    const {name,email} = request.body
    response.setHeader('Content-Type', 'application/json')
    if(tokenkey != 'contrasena'){
        response.send({
            status:"failed",
            message: "You sent wrong token's key"
        })
        return
    }
    insertNewClient({name, email}).then(insertedClient=>{
        response.send({
            status: "success",
            message: `Insert new Client successfully`,
            data: insertedClient
        })
    }).catch((error)=>{
        response.send({
            status: "failed",
            message: `Insert Client error: ${error}`
        })
    })
})

app.put("/update_client", (request, response) => {
    const { tokenkey } = request.headers
    const { clientId, name, email } = request.body
    response.setHeader('Content-Type', 'application/json')
    if(tokenkey != 'contrasena'){
        response.send({
            status:"failed",
            message: "You sent wrong token's key"
        })
        return
    }
    updateAnClient(Number(clientId) == NaN ? 0: Number(clientId), { name, email }).then(updatedClient =>{
        response.send({
            status: "success",
            message: `Update Client successfully`,
            data: updatedClient
        })
    }).catch((error) => {
        response.send({
            status: "failed",
            message: `Insert Client error: ${error}`
        })
    })
})

//Delete user
app.delete('/delete_client', (request, response) => {
    const{ tokenkey } = request.headers
    const{ clientId } = request.body
    response.setHeader('Content-Type', 'application/json')
    if(tokenkey != 'contrasena'){
        response.send({
            status:"failed",
            message: "You sent wrong token's key"
        })
        return
    }
    deleteClient(Number(clientId) == NaN ? 0: Number(clientId)).then(() => {
        response.send({
            status: "success",
            message: `Delete client with clientId=${clientId} successfully`
        })
        return
    }).catch((error) => {
        response.send({
            status: "failed",
            message: `Delete client error: ${error}`
        })
    })
})

module.exports = {
    app
}