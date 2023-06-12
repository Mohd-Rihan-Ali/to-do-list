require ('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const _ = require("lodash");
const Item = require('./models/items.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const connectDB = async () => {
  try{
    const conn =  await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connection is successful: ${conn.connection.host}`);
  }
  catch(err){
    console.log(err);
  }
}

const item1 = new Item({
      name: "Start with your organized day"
  });
  const item2 = new Item({
    name: "Start with your daily todo-list"
});
const defaultItems = [item1, item2];



// -----------------------------------------------------
//              Routes
// -----------------------------------------------------
app.get("/", function(req, res) {

  Item.find().then((foundItems) => {

    if(foundItems.length === 0){
      Item.insertMany(defaultItems);
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }    
  }).catch((err) => {
    console.log(err);
  });
});


app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

    item.save();
    res.redirect("/");

});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId)
      .then(deletedItem => {
        if (deletedItem) {
          console.log("hie");
          console.log("Item deleted:", deletedItem);
        }
        res.redirect("/");
      })
      .catch(err => {
        console.log(err.message);
        res.redirect("/");
      });
  
});


// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
});