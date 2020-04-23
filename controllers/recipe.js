const Recipe = require("../models/recipe");
const User = require("../models/user");
const ObjectId = require('mongoose').Types.ObjectId;

exports.myRecipes = (req, res) => {
    let userid = req.signedCookies.user;

    User.findOne({_id: userid})
    .populate('myrecipes')
    .exec()
    .then(user => {
        console.log(user.myrecipes);
        res.render("my_recipes", {recipes: user.myrecipes});
    });
};

exports.recipeBook = (req, res) => {
    let userid = req.signedCookies.user;

    User.findOne({_id: userid})
    .populate('recipebook')
    .exec()
    .then(user => {
        console.log(user.recipebook);
        res.render("recipe_book", {recipes: user.recipebook});
    });
};

exports.addRecipePage = (req, res) => {
    res.render("recipe_form", {recipe: {}, isEdit: false});
};

exports.saveRecipe = async function(req, res) {
    console.log(`POST received: ${req.method} ${req.url}`);
    var body = JSON.stringify(req.body);
    console.log("file: " + req.file);
    console.log(`${body}`);

    let userid = req.signedCookies.user;

    var image = "";
    if (req.file) {
        image = "uploads/" + req.file.filename;
    }


    if (req.body.isEdit === "true") {
        let recipeId = req.body.recipeId;

        var changes = {};
        changes.name = req.body.dishName;
        if (image) {
            changes.image = image;
        }
        changes.price = req.body.dishPrice;
        changes.ingredients = req.body.ingredients;
        changes.steps = req.body.steps;
        changes.video = req.body.videoLink;

        Recipe.findByIdAndUpdate(recipeId,
            changes,
            function (err, user) {
                if (err) throw err;
                console.log(user);
                res.redirect("/myrecipes");
            }
        );
    } else {
        let newRecipe = new Recipe({
            name: req.body.dishName,
            image: image,
            price: req.body.dishPrice,
            ingredients: req.body.ingredients,
            steps: req.body.steps,
            video: req.body.videoLink
        });

        newRecipe
            .save()
            .then((recipe) => {
                User.findByIdAndUpdate(userid,
                    { "$push": {myrecipes: recipe}},
                    function (err, user) {
                        if (err) throw err;
                        console.log(user);
                        res.redirect("/myrecipes");
                    }
                );
            
            })
            .catch(error => {
                res.send(error);
            });
    }
};

exports.editRecipePage = (req, res) => {
    let recipeid = req.params.recipeid;

    Recipe.findOne(ObjectId(recipeid))
    .exec()
    .then(recipes => {
        console.log(recipes);
        res.render("recipe_form", {recipe: recipes, isEdit: true});
    });
};

exports.recipePage = async function(req, res) {
    let recipeid = req.params.recipeid;
    let userid = req.signedCookies.user;

    var user = await User.findOne({_id: userid}).exec();
    if (user) {
        console.log(user.myrecipes);
        var recipe = await Recipe.findOne(ObjectId(recipeid)).exec();
        console.log(recipe);
        
        let enoughBalanceFlag = user.wallet >= recipe.price;

        let hideAddFlag = user.myrecipes.includes(recipeid)
            || user.recipebook.includes(recipeid);
    
        if (!hideAddFlag
            && recipe.price != 0) {
            res.render("recipe_lock", {recipe: recipe, enoughBalanceFlag: enoughBalanceFlag});
        } else {
            res.render("recipe_detail", {recipe: recipe, hideAddFlag: hideAddFlag});
        }

    } else {
        res.redirect('/');
    }
};

exports.addToRecipeBook = async function(req, res) {
    let recipeid = req.body.recipeid;
    let userid = req.signedCookies.user;

    User.findByIdAndUpdate(userid,
        { "$push": {recipebook: recipeid}},
        function (err, user) {
            if (err) throw err;
            console.log(user);
            res.redirect(`/recipe/${recipeid}`);
        }
    );
}

exports.payRecipe = async function(req, res) {
    let recipeid = req.body.recipeid;
    let userid = req.signedCookies.user;

    var recipe = await Recipe.findOne(ObjectId(recipeid)).exec();

    User.findByIdAndUpdate(userid,
        { 
            "$inc": {wallet: -recipe.price},
            "$push": {recipebook: recipeid}
        },
        function (err, user) {
            if (err) throw err;
            console.log(user);
            res.redirect(`/recipe/${recipeid}`);
        }
    );
}
