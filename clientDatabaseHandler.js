// var mongoClient = require('mongodb').MongoClient
// var url = 'mongodb://0.0.0.0:27017'
// const { ObjectId } = require('bson')
const {MongoClient,ObjectId} = require('mongodb')
const DATABASE_URL="mongodb+srv://ElAlmas:namkhanh2510@cluster0.kk1lwoe.mongodb.net/test"
const DATABASE_NAME='ElAlmas'
async function checkLogin(username,password){
    let db = await getDB()
    const result = await db.collection("Clients").
                    findOne({$and: [{username:username},{password:password}]})
    console.log(result)
    return result   
}
async function insertNewClient(newClient) {
    let db = await getDB()
    let id = await db.collection("Clients").insertOne(newClient)
    return id
}
async function getDB() {
    let client = await MongoClient.connect(DATABASE_URL)
    let db = client.db("CloudComputing")
    return db
}
async function getAllClient() {
    let db = await getDB()
    let results = await db.collection("Clients").find().toArray()
    return results
}
async function updateClient(username, email, password) {
    let db = await getDB()
    await db.collection("Clients").updateOne({ _id: ObjectId(id) },
        { $set: { "username": username, "email": email, "password": password } })
}
async function findClientById(id) {
    let db = await getDB()
    const ClientToEdit = await db.collection('Clients').findOne({ _id: ObjectId(id) })
    return ClientToEdit
}
async function deleteClientById(id) {
    let db = await getDB()
    await db.collection("Clients").deleteOne({ _id: ObjectId(id) })
}
async function findClientByName(nameSearch){
    let db = await getDB()
    const result = await db.collection("Clients").find({name: new RegExp(nameSearch, 'i')}).toArray()
    console.log(nameSearch)
    console.log(result)
    return result
}
module.exports = { insertNewClient, getAllClient, updateClient, findClientById, deleteClientById, findClientByName,checkLogin}