const User = require("../models/user");
module.exports.userRegister = (req, res) => {
  res.render("users/register");
};

module.exports.userRegisterlogic = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success", "welcome to yelpcamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
  // console.log(registerUser)
};
module.exports.loginpage = async (req, res) => {
  res.render("users/login");
};

module.exports.loginlogic = (req, res) => {
  req.flash("success", "login successful!");
  // res.redirect('/campgrounds');
  const redirectUrl = res.locals.returnTo || "/campgrounds"; // update this line to use res.locals.returnTo now
  res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};