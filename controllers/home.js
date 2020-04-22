const Recipe = require("../models/recipe");
const User = require("../models/user");

var recipes = [
    {
        id: "0",
        name: "Hokkien Mee",
        image: "/uploads/hokkienmee.jpg"
    },
    {
        id: "0",
        name: "Hokkien Mee",
        image: "/uploads/hokkienmee.jpg"
    },
    {
        id: "0",
        name: "Hokkien Mee",
        image: "/uploads/hokkienmee.jpg"
    }
];

exports.logRequests = (req, res, next) => {
    console.log(`request received: ${req.method} ${req.url}`);
    next();
};

exports.homePage = (req, res) => {
    Recipe.find({})
    .exec()
    .then(recipes => {
        console.log(recipes);
        res.render("home", {recipes: recipes});
    });
};

exports.search = (req, res) => {
    let search = req.body.search;
    console.log(req.body);
    // Recipe.find({name: '/Eagle/'}, null, { skip: 10 })
    // .exec()
    // .then(recipes => {
    //     console.log(recipes);
    //     res.render("home", {recipes: recipes});
    // });
    Recipe.find({name: new RegExp(search, 'i')}, null, function(err, recipes) {
        console.log("A" + recipes);
        res.render("home", {recipes: recipes});
    });
};

exports.login = (req, res) => {
    res.render("login", {layout: 'loginlayout'});
};

exports.performLogin = (req, res) => {
    var login = JSON.parse(req.body.login);
    console.log("name = " + login.name);
    console.log("id = " + login.id);

    User.create(
        {
            _id: login.id,
            name: login.name,
            myrecipes: [],
            recipebook: [],
            wallet: 100
        }, function(error, user) {

        res.cookie('user', login.id, {signed: true});
        res.redirect("/home");
    });

};