const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;

const userSchema = mongoose.Schema({
    _id: Number,
    name: String,
    myrecipes: [{ type: ObjectId, ref: "Recipe" }],
    recipebook: [{ type: ObjectId, ref: "Recipe" }],
    wallet: Number
});

module.exports = mongoose.model("User", userSchema);