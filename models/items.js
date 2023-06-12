const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
    name:  String
});

module.exports = Items =  mongoose.model("Item", itemsSchema); 
