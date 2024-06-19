if (process.env.NODE_ENV !== "productin") {
  require("dotenv").config();
}
// console.log(process.env.CLOUDINARY_SECRET);
const db_url = process.env.DB_URL;
const express = require("express");
const helmet = require("helmet");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campgroundsroutes = require("./routers/campground");
const Reviewsroutes = require("./routers/review");
const Userroutes = require("./routers/user");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");
const { func } = require("joi");

// const morgan = require("morgan");
// app.use(morgan("tiny"));
app.engine("ejs", ejsMate);
mongoose
  .connect(db_url)
  .then(() => {
    console.log("connected");
  })
  .catch((res) => {
    console.log("not connected", res);
  });
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// app.use(mongoSanitize());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
const store = MongoStore.create({
  mongoUrl: db_url,
  touchAfter: 24 * 60 * 60, //for a day
  crypto: {
    secret: "thisshouldbeabettersecret!",
  },
});
store.on("error", function (e) {
  console.log("session store error", e);
});
const sessionConfig = {
  store,
  name: "hana",
  secret: "abcd",
  resave: false,
  saveUninitialised: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/fakeuser", async (req, res) => {
  const user = new User({
    email: "gana2gmail.com",
    username: "gana",
  });
  const newUser = await User.register(user, "gana");
  res.send(newUser);
});

app.use("/campgrounds", Campgroundsroutes);
app.use("/campgrounds/:id/reviews", Reviewsroutes);
app.use("/", Userroutes);
app.use((req, res, next) => {
  res.status(404).send("404 not found");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh no something went wrong!";
  res.status(statusCode).render("Error", { err });
});
app.listen(3009, () => {
  console.log("serving on port 3009");
});
