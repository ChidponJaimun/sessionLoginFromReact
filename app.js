import dotenv from 'dotenv'; // dotenv import
// const ejs from "ejs"
// const _ from "lodash"
// const React from "react"
import React from "react";
import express from "express";
import mongoose from "mongoose";


const app = express();
dotenv.config();
const password = process.env.DB_PASSWORD;
console.log(password);

mongoose.connect("mongodb+srv://joe:"+password+"@goku.pna51.mongodb.net/checklist?retryWrites=true&w=majority", {
  useNewUrlParser: true
});


const userSchema = new mongoose.Schema({ // a part of encrypt added at new mongoose.Schema
  username: String,
  password: String,
});
const User = new mongoose.model("User", userSchema);


app.get("/",(req,res)=>{

  User.findOne({"username":"admin"}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        console.log(foundUser)
      }
    }
  });

})



app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
