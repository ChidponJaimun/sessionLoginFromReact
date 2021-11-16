import dotenv from 'dotenv'; // dotenv import
import ejs from "ejs"
// const _ from "lodash"
// const React from "react"
import React, { useState } from "react";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors"
import cache from "memory-cache";




const app = express();
dotenv.config();
app.use(express.static("public"));
// app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));

//axios
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });
// axios




// body parser
//ejs
app.set("view engine", "ejs");
//ejs

const password = process.env.DB_PASSWORD;

mongoose.connect("mongodb+srv://joe:" + password + "@goku.pna51.mongodb.net/checklist?retryWrites=true&w=majority", {
  useNewUrlParser: true
});


const userSchema = new mongoose.Schema({ // a part of encrypt added at new mongoose.Schema
  username: String,
  password: String,
});


const User = new mongoose.model("User", userSchema);

var loginCollector = [];

app.get("/register", (req, res) => {
  console.log("Registering");
  res.render("register");
});

app.post("/register", (req, res) => {
  console.log("Registering");
  if (req.body.regCode === "123456789") {

    bcrypt.hash(req.body.password, 10, (err, hashed) => {
      const newUser = new User({
        username: req.body.username,
        password: hashed
      });
      newUser.save((err) => {
        if (err) {
          res.send({
            responseMsg:err
          });
        } else {
          res.send({
            responseMsg:"Register Successful"
          });
        }
      });

    });


  } else {
    res.send({
      responseMsg:"Wrong Register Code"
    });
  }

});


app.get("/", (req, res) => {
  console.log(cache.get("loginToken"));
  // session = req.session;
  // if (session.userid) {
  //   res.redirect("/secrets");
  // } else {
  //   res.render("home");
  // }
});

app.post("/", (req, res) => {

  
  // if (session.userid !== "")  {
    if (true)  {
    res.send({
      text:"WTF",author:"WTFKER"
    });
  } else {
    res.send({
      text:"Need Login",author:"Need to Login First"
    })
  }
 
});

// app.get("/login", (req, res) => {
//   res.render("login", {
//     messages: "Welcome!!!"
//   })
// });


app.post("/login", (req, res) => {
  const loginUSR = req.body.username;
  let loginPWD = req.body.password;
 

  User.findOne({
    username: loginUSR
  }, function(err, foundUser) {
    if (err) {
      res.send({
        responseMsg:err
      });

    } else {
      if (foundUser) {
        bcrypt.compare(loginPWD, foundUser.password, function(err, result) {
          if (result === true) {
            var token = Math.floor(Math.random() * 10000000000);


            var tempToken = {usernameToken:loginUSR , token:token  }  // send this
            cache.put('loginToken', tempToken); 

            var temp =  loginCollector.filter(ele=>ele.usernameToken!==loginUSR);
            loginCollector = temp;
            loginCollector.push(cache.get("loginToken")); 
            
            
             
             
            console.log(loginCollector);
           
            
            res.send({
              responseMsg:"Successfully Login" , loginToken:tempToken  // to here
            });
          } else {
            res.send({
              responseMsg:"Wrong Password. Please retry again."
            });
          }
        });
      } else {
        res.send({
          responseMsg:"Username not found"
        });

      }

    }
  });

});


app.post('/loginCheck',(req,res) => {
  const loginUSR = req.body.user;
  const loginToken = req.body.token;
  var tempRes = loginCollector.find(elle=>elle.usernameToken===loginUSR && elle.token===loginToken)
  console.log("checking");
  if(tempRes){
    res.send({
      responseMsg:"pass"
    });
  }else{
    res.send({
      responseMsg:"Not Pass"
    });
  }
  
});

app.post('/logout',(req,res) => {
   

   
    res.send({
      responseMsg:"Successfully Logout"
    });
});






app.listen(process.env.PORT || 5000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
