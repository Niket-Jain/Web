//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose  = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

// const bcrypt= require("bcrypt");
// const saltRounds = 8;
// const md5= require("md5");
// const encrypt = require("mongoose-encryption")

const app = express();

app.use(express.static("public"));

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
  extended: true}));

app.use(session({
  secret: "Episten didnt killed himself",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleID: String,
  secret: String
});

// To use this schema it should be a mangoose Schema
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

// This is applicable to every package
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// This is for locally Mongoose Package
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res){
 res.render("home");
});

app.get('/auth/google', function(req, res){
  passport.authenticate('google', { scope: ['profile'] })
  console.log("Hua authenticate?");
});

app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets page.
    res.redirect("/secrets");
  });

app.get("/login", function(req, res){
 res.render("login");
});


app.get("/register", function(req, res){
 res.render("register");
});

app.get("/secrets",function(req, res){
  // if (req.isAuthenticated()) {
  //   res.render("secrets"); // Render is to render the ejs template from the Views folder.
  // } else {
  //   res.redirect("/login"); // Redirect is to re-direct the route
  // }

  User.find({"secret": {$ne: null}}, function(error, foundUsers){
    if (error) {
      console.log(error);
    }else{
      if (foundUsers) {
        res.render("secrets", {usersWithSecret: foundUsers});
      }
    }
  });
});

app.get("/submit", function(req, res){
  if (req.isAuthenticated()) {
    res.render("submit"); // Render is to render the ejs template from the Views folder.
  } else {
    res.redirect("/login"); // Redirect is to re-direct the route.
  }
});

app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;
  const id = req.user._id;
  User.findById(id, function(error, foundUser){
    if (error) {
      console.log(error);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          res.redirect("/secrets");
        });
      }
    }
  });
});

app.get("/logout",function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){

User.register({username: req.body.username}, req.body.password, function(error, user){
  if (error) {
    console.log(error);
    res.redirect("/register");
  } else {
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secrets");
    });
  }
});

// bcrypt.hash(req.body.password, saltRounds , function(error, hash){
//   const newUser = new User({
//     email: req.body.username,
//     password: hash
//   });
//   // When we save the files Encryption start Automatically.
//       newUser.save(function(error){
//         if (!error) {
//           console.log("Successfully Registered");
//           res.render("secrets");
//         } else {
//           console.log("There is problem in registering");
//         }
//       });
});

app.post("/login", function(req, res){

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, function(error){
      if (error) {
        console.log("Error_Login" + error);
      } else {
        passport.authenticate("local")(req, res, function(){
          console.log("Login Successfully");
          res.redirect("/secrets");
        });
      }
    });

  // const usernmae = req.body.username;
  // const password= req.body.password;
  //
  // // When we find those files Encryption stop Automatically.
  // User.findOne({email: usernmae}, function(error, foundUser){
  //   if (error) {
  //     console.log("Error In Login Post");
  //   } else {
  //     if(foundUser){
  //       // This will compare the two passwords and Login the User if the Result is true
  //       bcrypt.compare(password, foundUser.password, function(error, result){
  //         if (result === true) {
  //           res.render("secrets");
  //           console.log("Successfully logged in");
  //         } else {
  //           console.log("Can't Login");
  //         }
  //       });
  //     }
  //   }
  // });
});

app.listen(3000,function(){
  console.log("Server has started on port 3000: ");
});
