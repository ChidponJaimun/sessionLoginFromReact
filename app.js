import dotenv from 'dotenv'; // dotenv import
import ejs from "ejs"
// const _ from "lodash"
// const React from "react"
import React from "react";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import sessions from 'express-session';


const sessionAge = 1000 * 60 * 60;
var session;

const app = express();
dotenv.config();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser("secretcode"));

app.use(sessions({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  cookie: {
    maxAge: sessionAge
  },
  resave: false
}));


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



app.get("/register", (req, res) => {
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
          console.log(err);
        } else {
          res.redirect("/login");
        }
      });

    });


  } else {
    res.render("errorpage", {
      errorCode: "Wrong Register Code!!"
    })
  }

});

app.get("/", (req, res) => {
  session = req.session;
  if (session.userid) {
    res.redirect("/secrets");
  } else {
    res.render("home");
  }
});


app.get("/login", (req, res) => {
  res.render("login", {
    messages: "Welcome!!!"
  })
});


app.post("/login", (req, res) => {
  const loginUSR = req.body.username;
  let loginPWD = req.body.password;


  User.findOne({
    username: loginUSR
  }, function(err, foundUser) {
    if (err) {
      console.log(err);

    } else {
      if (foundUser) {
        bcrypt.compare(loginPWD, foundUser.password, function(err, result) {
          if (result === true) {
            session = req.session;
            session.userid = loginUSR;
            res.redirect("/secrets");
          } else {
            res.render("login", {
              messages: "Wrong password"
            });
          }
        });
      } else {
        res.render("login", {
          messages: "Username not found"
        });
      }

    }
  });

});

app.get("/secrets", (req, res) => {

  session = req.session;
  if (session.userid) {
    res.render("secrets", {
      messages: "Logged in."
    });
  } else {
    res.render("login", {
      messages: "Please Logged in."
    });
  }

});

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});




app.listen(process.env.PORT || 5000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
