var express = require('express')
var app = express()

const bodyParser = require("body-parser");
// const sessions = require('express-session')

var router = express.Router()
const { insertNewClient, getAllClient, updateClient, findClientById, deleteClientById, findClientByName, checkLogin} = require('./clientDatabaseHandler.js')


app.use(bodyParser.urlencoded({ extended:true }));
// const oneDay = 1000*60*60*24;
// router.use(sessions({
//     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//     saveUninitialized:false,
//     cookie: { maxAge: oneDay },
//     resave: false
// }));


router.post('/addClient',async(req,res)=>{
    const name = req.body.userName
    const email = req.body.email
    const password = req.body.password
    const newClient = {
        username :name,
        email: email,
        password: password,
        role: 'client'
    }
    await insertNewClient(newClient)
    console.log(newClient.username)
    let session=req.session;
    //tao mot bien la userid trong session
    session.userid = newClient.username
    session.userRole = newClient.role
    console.log(req.session)
    res.redirect('/')
})
router.post('/login',async (req,res)=>{
    let userLogin = await checkLogin(req.body.username,req.body.password)
    if(userLogin){
        let session=req.session;
        //tao mot bien la userid trong session
        session.userid = userLogin.username
        session.userRole = userLogin.role
        console.log(req.session)
        res.redirect('/')
    }
    else{
        res.render('client/login',{'notice':'Invalid username or password'})
    }
})
router.get('/login',(req,res)=>{
    res.render('client/login')
})
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.render('home')
})
module.exports = router