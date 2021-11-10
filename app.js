import dotenv from 'dotenv'; // dotenv import
import ejs from "ejs"
// const _ from "lodash"
// const React from "react"
import React from "react";
import express from "express";
import mongoose from "mongoose";



const app = express();
dotenv.config();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// body parser
//ejs
app.set("view engine", "ejs");
//ejs

const password = process.env.DB_PASSWORD;

mongoose.connect("mongodb+srv://joe:"+password+"@goku.pna51.mongodb.net/checklist?retryWrites=true&w=majority", {
  useNewUrlParser: true
});


const userSchema = new mongoose.Schema({ // a part of encrypt added at new mongoose.Schema
  username: String,
  password: String,
});


const User = new mongoose.model("User", userSchema);


app.get("/",(req,res)=>{
 res.render("login");


});

app.get("/login",(req,res)=>{
 res.render("login");
});

app.post("/login",(req,res)=>{
  User.findOne({"username":"admin"}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        console.log(foundUser)
      }
    }
  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
