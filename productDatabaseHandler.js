const {MongoClient,ObjectId} = require('mongodb')
const DATABASE_URL="mongodb+srv://ElAlmas:namkhanh2510@cluster0.kk1lwoe.mongodb.net/test"

async function insertNewProduct(newProducts) {
    let db = await getDB()
    let id = await db.collection("Products").insertOne(newProducts)
    return id
}
async function getDB() {
    let products = await MongoClient.connect(DATABASE_URL)
    let db = products.db("CloudComputing")
    return db
}
async function getAllProduct() {
    let db = await getDB()
    let results = await db.collection("Products").find().toArray()
    return results
}   
async function updateProduct(id, productName, price, picture, quantity) {
    let db = await getDB()
    await db.collection("Products").updateOne({ _id: ObjectId(id)},
        { $set: { "productName": productName, "price": price, "picture": picture , "quantity": quantity} })
}
async function findProductById(id) {
    let db = await getDB()
    const productToEdit = await db.collection('Products').findOne({ _id: ObjectId(id) })
    return productToEdit
}
async function deleteProductById(id) {
    let db = await getDB()
    await db.collection("Products").deleteOne({ _id: ObjectId(id) })
}
async function findProductByName(nameSearch){
    let db = await getDB()
    const result = await db.collection("Products").find({productName: new RegExp(nameSearch, 'i')}).toArray()
    console.log(nameSearch)
    console.log(result)
    return result
}
module.exports = { insertNewProduct, getAllProduct, updateProduct, findProductById, deleteProductById, findProductByName}