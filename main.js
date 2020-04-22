const port = 3000;
const express = require("express");
const layouts = require("express-ejs-layouts");
const multer = require("multer");
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb://localhost:27017/cookcircle_db",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
);
const db = mongoose.connection;

db.once("open", () => {                                             1
    console.log("Connected to MongoDB using Mongoose");
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
const upload = multer({storage: storage})

const app = express();

const homeController = require("./controllers/home");
const userController = require("./controllers/user");
const recipeController = require("./controllers/recipe");
const errorController = require("./controllers/error");



app.set("view engine", "ejs");

app.use(express.static("public")) 
app.use(layouts);
app.use(cookieParser("cookcircle"));

app.use(homeController.logRequests);

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());


app.get("/home", homeController.homePage);
app.post("/search", homeController.search);
app.get("/", homeController.login);
app.post("/", homeController.performLogin);

app.get("/recipe/:recipeid", recipeController.recipePage);
app.get("/myrecipes", recipeController.myRecipes);
app.get("/addrecipe", recipeController.addRecipePage);

app.post("/recipe", upload.single('inputImage'), recipeController.saveRecipe);
app.post("/recipe", upload.none(), recipeController.saveRecipe);

app.get("/recipe/:recipeid/edit", recipeController.editRecipePage);
app.get("/recipebook", recipeController.recipeBook);
app.get("/profile", userController.profilePage);

app.post("/addtorecipebook", recipeController.addToRecipeBook);
app.post("/payrecipe", recipeController.payRecipe);

app.get('/logout', function(req, res){
  res.clearCookie("user");
  res.redirect('/');
});

app.get('/check', function(req, res) {
  res.send(req.signedCookies.user);
});

app.use(errorController.logErrors);

app.listen(port, () => {
    console.log(`Use your web browser and open http://localhost:${port}`);
});