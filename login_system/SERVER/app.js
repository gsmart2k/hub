var express = require("express")
var app = express()
var expressValidator = require("express-validator");
var expressSession = require("express-session");
var bodyparser = require('body-parser');
var users = require("./users");
var bcrypt = require('bcrypt');


app.set("view engine", "ejs")
app.use('/', express.static('./views/css/'));
const PORT =  4000
var urlencodedparser = bodyparser.urlencoded({extended:false})
app.use(expressValidator())
app.use(expressSession({secret:"smart", saveUninitialized:false, resave: false}))



app.get('/', (req,res)=>{
    res.render("./index",{title:"Form Validation", success:req.session.success, errors: req.session.errors})
    req.session.errors = null
    req.session.success = null
    console.log(req)
   });
   app.post("/", urlencodedparser, async(req, res)=>{

    req.check("email", "Invalid Email Address").isEmail()
    req.check("password", "Password too short").isLength({min:5})
    req.check("password","Passwords do not correspond").equals(req.body.confirmPassword);
   var errors = req.validationErrors()
    if(errors){
        req.session.errors = errors;
        res.redirect('/')
        req.session.success = false

    }else{
        req.session.success = true
        res.redirect("/")
    }
    
    // setTimeout(()=>{
    //    window.location("/login");
    //    },5000)
       
       try{
       const salt = await bcrypt.genSalt()
       const hashed = await bcrypt.hash(req.body.password, salt)
       var username = (req.body.First_name)
       var password = hashed
       var email = (req.body.Email)
       users.push({username,password,email})
       console.log(users)
   }catch(error){
       console.log(error)
   }
   })
   
   app.get('/login', (req,res)=>{
       res.render("./login")
       console.log(req)
      })
      app.post("/login", urlencodedparser, async(req, res)=>{
          try{
          var email = (req.body.email)
          var password = req.body.password
          console.log(email)
          console.log(password)
         const findusers = users.find(user=>{
            return user.email === email && user.password === password
         })
         console.log(email)
         console.log(findusers)
         if(findusers){
           res.redirect("./dashboard")
         console.log("USER AVAILABLE")
         }else {
             const errmsg = "INCORRECT INFORMATION"
         }     
      }catch(error){
          res.status(500).send()
          console.log(error)
      }
      })
      app.get('/dashboard', (req,res)=>{
       res.render("./dashboard", {title:"welcome",body:"You are welcome"})
      })

app.listen(PORT)
console.log(`Server Now running on Port ${PORT}`)
