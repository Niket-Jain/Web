const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

// set the ejs (templates)
app.set('view engine', 'ejs');

// Init Body parser to the Server
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// To create a new Database.
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// new Schema
const itemSchema = {
  name : String
}

// New Mongo Model
const Item = mongoose.model("item", itemSchema)

// New Default Items that added to the DB for demo.
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultArray = [item1, item2, item3];

// New Schema for default Routes.
const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

// To call the functions use () with the function.
let day = date(); // Global Var.

//to setup the server
app.get("/", function(req, res) {

  // To retrive the data from the DB

  Item.find({}, function(error, foundItems) {

    // To check if the DB is empty or not.
    if (foundItems.length === 0) {
      // Insert Data to DB.
      Item.insertMany(defaultArray, function(error) {
        if (error) {
          console.log("Error in Insert");
        } else {
          console.log("Success Insert");
        }
      });

      res.redirect("/"); // redirect to root route.

    } else {
      res.render("lists", {listTitle: "Today", newListItems: foundItems});
    }
  });
});

// Different Route Parameters.

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList) { // FindOne ==> One Object
    if (!err) {
      if (!foundList) {
        // Doesnt exists, so create one
        const list = new List({
          name: customListName,
          items: defaultArray
        });

        list.save();
        res.redirect("/" + customListName);

      } else {
        // Means list exists so rendeer new Dynamic page.
        res.render("lists", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });

});

// start rendering the data from the Web
app.post("/", function(req, res) {
  // Extract Data from the inputs.
  const itemName = req.body.newItem;
  const listName= req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save(); // Shortcut to safe data to the DB.
    res.redirect("/");
    // To redirect to home page. Initially it will have no Data and to
    // prevent from crashing the web page
  }
  else{
    List.findOne({name: listName}, function(err, foundList){
      // Add data to the list==> Array
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      });
  }
});


app.post("/delete", function(req, res) {
    // Extract Data from the inputs.
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(error) {
      if (error) {
        console.log("Error Deleting the Item");
      } else {
        console.log("Successfully Deleted the Item");
        res.redirect("/");
      }
    });
  }else{
    // method({Attribute of the Item },{To choose which Attribute to be updated},callbacks)

    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/about", function(req, res){
  console.log("Is it rendering About page??");
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server has started");
});
