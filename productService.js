var express = require('express')
var app = express()

const bodyParser = require("body-parser");
// const sessions = require('express-session')

// var MongoClient = require('mongodb').MongoClient
// var url = 'mongodb://0.0.0.0:27017'

var router = express.Router()
const { insertNewProduct, getAllProduct, updateProduct, findProductById, deleteProductById, findProductByName} = require('./productDatabaseHandler.js')


app.use(bodyParser.urlencoded({ extended:true }));
// const oneDay = 1000*60*60*24;
// router.use(sessions({
//     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//     saveUninitialized:false,
//     cookie: { maxAge: oneDay },
//     resave: false
// }));

router.get('/add',(req,res)=>{
    if(req.session){
        session=req.session;
        let userName = session.userid
        let userRole = session.userRole
        // console.log(userName)
        res.render('product/addForm',{'user':userName,'role':userRole})
    }else{
        res.render('product/addForm')
    }
})
router.get('/allProducts',async(req,res)=>{
    let results = await getAllProduct()
    if(req.session){
        session=req.session;
        let userName = session.userid
        let userRole = session.userRole
        // console.log(userName)
        res.render('product/allProducts',{'results':results,'user':userName,'role':userRole})
    }else{
        res.render('product/allProducts',{'results':results})
    }
})
router.get('/edit',async(req,res)=>{
    const id = req.query.id
    const editProduct = await findProductById(id)
    if(req.session){
        session=req.session;
        let userName = session.userid
        let userRole = session.userRole
        // console.log(userName)
        res.render('product/editForm',{'product':editProduct,'user':userName,'role':userRole})
    }else{
        res.render('product/editForm',{'product':editProduct})
    }
})
router.get('/delete',async (req,res)=>{
    const id = req.query.id
    await deleteProductById(id)
    res.redirect('/product/allProducts')
})
router.post('/add',async(req,res)=>{
    const productName = req.body.productName
    const price = req.body.price
    const picture = req.body.picture
    const quantity = req.body.quantity
    if(productName.length< 5){
        res.render('product/addForm',{'notice':"Not enough length for name"})
    }else if (price<10 || price >1000){
        res.render('product/addForm',{'notice':"Invalid price"})
    }else if(quantity<10 || quantity >1000){
        res.render('product/addForm',{'notice':"Invalid quantity"})
    }else if (picture.length ==0){
        res.render('product/addForm',{'notice':"Invalid picture"})
    }else{
        const newProduct = {
            productName :productName,
            price: price,
            quantity : quantity,
            picture: picture
        }
        await insertNewProduct(newProduct)
        res.redirect('/product/allProducts')
    }
})
router.post('/edit',async(req,res)=>{
    const id = req.body.id
    const productName = req.body.productName
    const price = req.body.price
    const quantity = req.body.quantity
    const picture = req.body.picture
    const editProduct = await findProductById(id)
    if(productName.length< 5){ 
        res.render('product/editForm', {'product': editProduct ,'notice':"Not enough length for name"})
    }else if (price<10 || price >1000){
        res.render('product/editForm',{'product': editProduct ,'notice':"Invalid price"})
    }else if(quantity<10 || quantity >1000){
        res.render('product/editForm',{'product': editProduct ,'notice':"Invalid quantity"})
    }else if (picture.length ==0){
        res.render('product/editForm',{'product': editProduct ,'notice':"Invalid picture"})
    }else{
        await updateProduct(id,productName,price,picture, quantity)
        res.redirect('/product/allProducts')
    }
})
router.post('/search',async (req,res)=>{
    const searchName = req.body.txtName
    const searchResult = await findProductByName(searchName)
    res.render('product/allProducts',{results:searchResult})
})
module.exports = router