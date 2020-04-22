const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    ingredients: String,
    steps: String,
    video: String
});

module.exports = mongoose.model("Recipe", recipeSchema);