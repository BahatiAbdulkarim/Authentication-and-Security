//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { stringify } = require("querystring");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.set('strictQuery', false);

mongoose.connect("mongodb://localhost:27017/usersDB", { useNewUrlParser: true });


const userSchema = new mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String

    }
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"]});


const User = new mongoose.model("User", userSchema);



app.get("/", function (req, res) {

    res.render("home");
  
  });




app.get("/register", function (req, res) {

  res.render("register");

});
app.get("/login", function (req, res) {

  res.render("login");

});

app.get("/submit", function (req, res) {

  res.render("submit");

});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.useremail,
        password: req.body.password
    });

    newUser.save(function (err) {
        if(err){
            console.log(err);
        }else{
            res.render("secrets")
        }
        
    })
    
});

app.post("/login", function (req, res) {
    const useremail = req.body.useremail;
    const userpassword = req.body.password

    User.findOne({email:useremail}, function (err, foundUser) {
        if(err){
            console.log(err);

        }else{
            if(foundUser){
                if(foundUser.password === userpassword){
                    res.render("secrets")
                }else{
                    res.json("wrong password")
                }
            }
        }
        
    })
    
})




// export 'app'
module.exports = app



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
