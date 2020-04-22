const User = require("../models/user");

exports.profilePage = (req, res) => {
    let userid = req.signedCookies.user;

    User.findOne({_id: userid})
    .exec()
    .then(user => {
        res.render("profile", {user: user});
    });
};