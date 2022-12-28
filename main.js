var express = require('express');
const sessions = require('express-session');
var app = express()

app.set('view engine','hbs')
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

const hbs = require('hbs')
hbs.registerHelper('priceCheck',function(price){
    if(price >= 50){
        return 'red'
    }else{
        return 'green'
    }
})

const oneDay = 1000*60*60*24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    resave: false
}));
var clientService = require('./clientService')
app.use("/client",clientService)

var productService = require('./productService')
app.use("/product",productService)


app.get('/',(req,res)=>{
    if(req.session){
        session=req.session;
        let userName = session.userid
        let userRole = session.userRole
        // console.log(userName)
        res.render('home',{'user':userName,'role':userRole})
    }else{
        res.render('home')
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, (req,res)=>{
    console.log("Server is running")
})
